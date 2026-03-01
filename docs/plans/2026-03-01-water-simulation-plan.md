# Water Simulation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** CA 기반 물 시뮬레이션 — 지형 생성 시 강/폭포 자동 생성 + 런타임 물 흐름

**Architecture:** Rust WASM에서 `WaterSimulator` trait 기반 DI 구조로 CA 시뮬레이션 수행. TypeScript에서 제로카피로 water levels를 읽어 level 기반 렌더링. 시뮬레이션 tick(200ms)과 렌더 루프(rAF)는 독립 동작.

**Tech Stack:** Rust (wasm-bindgen, noise crate), TypeScript, React, Canvas 2D

---

### Task 1: WaterState & WaterSimulator trait 정의

**Files:**
- Create: `core/src/water/mod.rs`
- Create: `core/src/water/cellular.rs`

**Step 1: Write the test for WaterState**

`core/src/water/mod.rs` 하단에 테스트 모듈 추가:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn water_state_new_initializes_empty() {
        let state = WaterState::new(4, 4, 4);
        assert_eq!(state.width(), 4);
        assert_eq!(state.depth(), 4);
        assert_eq!(state.height(), 4);
        assert_eq!(state.get(0, 0, 0).level, 0);
        assert!(!state.get(0, 0, 0).is_source);
    }

    #[test]
    fn water_state_set_and_get() {
        let mut state = WaterState::new(4, 4, 4);
        state.set(1, 2, 3, WaterCell { level: 5, is_source: true });
        let cell = state.get(1, 2, 3);
        assert_eq!(cell.level, 5);
        assert!(cell.is_source);
    }

    #[test]
    fn water_state_pack_unpack_roundtrip() {
        let cell = WaterCell { level: 8, is_source: true };
        let packed = cell.pack();
        let unpacked = WaterCell::unpack(packed);
        assert_eq!(unpacked.level, 8);
        assert!(unpacked.is_source);
    }

    #[test]
    fn water_levels_returns_packed_data() {
        let mut state = WaterState::new(2, 2, 2);
        state.set(0, 0, 0, WaterCell { level: 4, is_source: false });
        state.set(1, 0, 0, WaterCell { level: 8, is_source: true });
        let levels = state.levels();
        assert_eq!(levels[0], 4);            // level=4, no source
        assert_eq!(levels[1], 0x80 | 8);     // level=8, source bit set
    }
}
```

**Step 2: Run test to verify it fails**

Run: `cd core && cargo test water`
Expected: FAIL — `WaterState`, `WaterCell` not defined

**Step 3: Implement WaterState, WaterCell, WaterSimulator trait**

`core/src/water/mod.rs`:

```rust
pub mod cellular;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct WaterCell {
    pub level: u8,
    pub is_source: bool,
}

impl WaterCell {
    pub const EMPTY: Self = Self { level: 0, is_source: false };

    pub fn pack(self) -> u8 {
        let source_bit = if self.is_source { 0x80 } else { 0 };
        source_bit | (self.level & 0x7F)
    }

    pub fn unpack(packed: u8) -> Self {
        Self {
            level: packed & 0x7F,
            is_source: packed & 0x80 != 0,
        }
    }
}

pub struct WaterState {
    width: usize,
    depth: usize,
    height: usize,
    cells: Vec<WaterCell>,
    levels_cache: Vec<u8>,
}

impl WaterState {
    pub fn new(width: usize, depth: usize, height: usize) -> Self {
        let size = width * depth * height;
        Self {
            width,
            depth,
            height,
            cells: vec![WaterCell::EMPTY; size],
            levels_cache: vec![0u8; size],
        }
    }

    pub fn width(&self) -> usize { self.width }
    pub fn depth(&self) -> usize { self.depth }
    pub fn height(&self) -> usize { self.height }

    fn index(&self, x: usize, y: usize, z: usize) -> usize {
        x + y * self.width + z * self.width * self.depth
    }

    pub fn get(&self, x: usize, y: usize, z: usize) -> WaterCell {
        self.cells[self.index(x, y, z)]
    }

    pub fn set(&mut self, x: usize, y: usize, z: usize, cell: WaterCell) {
        let idx = self.index(x, y, z);
        self.cells[idx] = cell;
    }

    pub fn sync_levels_cache(&mut self) {
        for (i, cell) in self.cells.iter().enumerate() {
            self.levels_cache[i] = cell.pack();
        }
    }

    pub fn levels(&self) -> &[u8] {
        // 호출 전 sync_levels_cache() 필요 — 또는 매번 계산
        // 간단하게 매번 계산하는 방식 사용
        // (실제 구현에서는 sync_levels_cache 방식 사용)
        &self.levels_cache
    }

    pub fn levels_ptr(&self) -> *const u8 {
        self.levels_cache.as_ptr()
    }

    pub fn levels_len(&self) -> usize {
        self.levels_cache.len()
    }
}

pub trait WaterSimulator {
    fn tick(&mut self, state: &mut WaterState, terrain: &[u8]);
    fn place_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize, level: u8);
    fn remove_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize);
}
```

`core/src/water/cellular.rs` — 빈 구현체 스텁:

```rust
use super::{WaterCell, WaterSimulator, WaterState};

pub struct CellularWaterSimulator;

impl CellularWaterSimulator {
    pub fn new() -> Self {
        Self
    }
}

impl WaterSimulator for CellularWaterSimulator {
    fn tick(&mut self, _state: &mut WaterState, _terrain: &[u8]) {}
    fn place_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize, level: u8) {
        state.set(x, y, z, WaterCell { level, is_source: false });
    }
    fn remove_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize) {
        state.set(x, y, z, WaterCell::EMPTY);
    }
}
```

**Step 4: Run test to verify it passes**

Run: `cd core && cargo test water`
Expected: 4 tests PASS

**Step 5: Commit**

```bash
git add core/src/water/
git commit -m "feat(water): add WaterState, WaterCell, and WaterSimulator trait"
```

---

### Task 2: World 제네릭화 — World\<S: WaterSimulator\>

**Files:**
- Modify: `core/src/world.rs`
- Modify: `core/src/lib.rs` (mod 선언 추가)

**Step 1: Write the test**

`core/src/world.rs` 하단에 테스트 추가:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use crate::water::cellular::CellularWaterSimulator;

    #[test]
    fn world_new_with_simulator() {
        let world = World::new(4, 4, 4, CellularWaterSimulator::new());
        assert_eq!(world.width(), 4);
        assert_eq!(world.depth(), 4);
        assert_eq!(world.height(), 4);
    }

    #[test]
    fn world_tick_water_does_not_panic() {
        let mut world = World::new(4, 4, 4, CellularWaterSimulator::new());
        world.tick_water(); // 빈 구현이므로 패닉 없이 완료
    }

    #[test]
    fn world_place_and_get_water() {
        let mut world = World::new(4, 4, 4, CellularWaterSimulator::new());
        world.place_water(1, 1, 1, 5);
        let cell = world.water().get(1, 1, 1);
        assert_eq!(cell.level, 5);
    }
}
```

**Step 2: Run test to verify it fails**

Run: `cd core && cargo test world::tests`
Expected: FAIL — `World::new` signature changed

**Step 3: Modify World to be generic**

`core/src/world.rs` — 전체 수정:

```rust
use crate::tile::TileType;
use crate::water::{WaterSimulator, WaterState};

pub struct World<S: WaterSimulator> {
    width: usize,
    depth: usize,
    height: usize,
    tiles: Vec<u8>,
    water: WaterState,
    simulator: S,
}

impl<S: WaterSimulator> World<S> {
    pub fn new(width: usize, depth: usize, height: usize, simulator: S) -> Self {
        let tiles = vec![TileType::Air as u8; width * depth * height];
        let water = WaterState::new(width, depth, height);
        Self { width, depth, height, tiles, water, simulator }
    }

    pub fn width(&self) -> usize { self.width }
    pub fn depth(&self) -> usize { self.depth }
    pub fn height(&self) -> usize { self.height }

    pub fn index(&self, x: usize, y: usize, z: usize) -> usize {
        x + y * self.width + z * self.width * self.depth
    }

    pub fn set_tile(&mut self, x: usize, y: usize, z: usize, tile: TileType) {
        let idx = self.index(x, y, z);
        self.tiles[idx] = tile as u8;
    }

    #[allow(dead_code)]
    pub fn get_tile(&self, x: usize, y: usize, z: usize) -> u8 {
        self.tiles[self.index(x, y, z)]
    }

    pub fn tiles_ptr(&self) -> *const u8 { self.tiles.as_ptr() }
    pub fn tiles_len(&self) -> usize { self.tiles.len() }
    pub fn tiles(&self) -> &[u8] { &self.tiles }

    // Water delegation
    pub fn water(&self) -> &WaterState { &self.water }

    pub fn tick_water(&mut self) {
        self.simulator.tick(&mut self.water, &self.tiles);
        self.water.sync_levels_cache();
    }

    pub fn place_water(&mut self, x: usize, y: usize, z: usize, level: u8) {
        self.simulator.place_water(&mut self.water, x, y, z, level);
        self.water.sync_levels_cache();
    }

    pub fn remove_water(&mut self, x: usize, y: usize, z: usize) {
        self.simulator.remove_water(&mut self.water, x, y, z);
        self.water.sync_levels_cache();
    }

    pub fn water_levels_ptr(&self) -> *const u8 { self.water.levels_ptr() }
    pub fn water_levels_len(&self) -> usize { self.water.levels_len() }
}
```

`core/src/lib.rs` — `mod water` 추가 및 `World` 제네릭 반영:

```rust
mod terrain;
mod tile;
mod water;
mod world;

use std::cell::UnsafeCell;
use wasm_bindgen::prelude::*;
use water::cellular::CellularWaterSimulator;
use world::World;

type GameWorld = World<CellularWaterSimulator>;

struct WorldHolder(UnsafeCell<Option<GameWorld>>);

unsafe impl Sync for WorldHolder {}

static WORLD: WorldHolder = WorldHolder(UnsafeCell::new(None));

fn with_world<T>(f: impl FnOnce(&GameWorld) -> T, default: T) -> T {
    unsafe { (*WORLD.0.get()).as_ref().map_or(default, f) }
}

fn with_world_mut<T>(f: impl FnOnce(&mut GameWorld) -> T, default: T) -> T {
    unsafe { (*WORLD.0.get()).as_mut().map_or(default, f) }
}

#[wasm_bindgen]
pub fn greet() -> String {
    String::from("Hello from game-core!")
}

#[wasm_bindgen]
pub fn create_world(width: usize, depth: usize, height: usize, seed: u32) {
    let simulator = CellularWaterSimulator::new();
    let mut w = World::new(width, depth, height, simulator);
    terrain::generate_terrain(&mut w, seed);
    unsafe {
        *WORLD.0.get() = Some(w);
    }
}

// --- Tiles ---
#[wasm_bindgen]
pub fn world_tiles_ptr() -> *const u8 { with_world(|w| w.tiles_ptr(), std::ptr::null()) }
#[wasm_bindgen]
pub fn world_tiles_len() -> usize { with_world(|w| w.tiles_len(), 0) }
#[wasm_bindgen]
pub fn world_width() -> usize { with_world(|w| w.width(), 0) }
#[wasm_bindgen]
pub fn world_depth() -> usize { with_world(|w| w.depth(), 0) }
#[wasm_bindgen]
pub fn world_height() -> usize { with_world(|w| w.height(), 0) }

// --- Water ---
#[wasm_bindgen]
pub fn tick_water() { with_world_mut(|w| w.tick_water(), ()); }
#[wasm_bindgen]
pub fn place_water(x: usize, y: usize, z: usize, level: u8) {
    with_world_mut(|w| w.place_water(x, y, z, level), ());
}
#[wasm_bindgen]
pub fn remove_water(x: usize, y: usize, z: usize) {
    with_world_mut(|w| w.remove_water(x, y, z), ());
}
#[wasm_bindgen]
pub fn water_levels_ptr() -> *const u8 { with_world(|w| w.water_levels_ptr(), std::ptr::null()) }
#[wasm_bindgen]
pub fn water_levels_len() -> usize { with_world(|w| w.water_levels_len(), 0) }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greet_returns_message() {
        assert_eq!(greet(), "Hello from game-core!");
    }
}
```

**Step 4: Update terrain.rs to use generic World**

`core/src/terrain.rs` — 시그니처만 제네릭화:

```rust
use noise::{Fbm, MultiFractal, NoiseFn, Perlin};

use crate::tile::TileType;
use crate::water::WaterSimulator;
use crate::world::World;

const WATER_LEVEL: usize = 8;
const NOISE_SCALE: f64 = 0.03;

pub fn generate_terrain<S: WaterSimulator>(world: &mut World<S>, seed: u32) {
    // 기존 로직 동일 — 변경 없음
    let fbm = Fbm::<Perlin>::new(seed)
        .set_octaves(6)
        .set_frequency(NOISE_SCALE);

    let width = world.width();
    let depth = world.depth();
    let height = world.height();

    for y in 0..depth {
        for x in 0..width {
            let noise_val = fbm.get([x as f64, y as f64]);
            let normalized = ((noise_val + 1.0) / 2.0).clamp(0.0, 1.0);
            let surface_z = (normalized * (height as f64 * 0.6)) as usize + 2;
            let surface_z = surface_z.min(height - 1);

            for z in 0..=surface_z {
                let tile = if z < surface_z.saturating_sub(3) {
                    TileType::Stone
                } else if z < surface_z {
                    TileType::Dirt
                } else if surface_z <= WATER_LEVEL {
                    TileType::Sand
                } else {
                    TileType::Grass
                };
                world.set_tile(x, y, z, tile);
            }

            if surface_z < WATER_LEVEL {
                for z in (surface_z + 1)..=WATER_LEVEL {
                    world.set_tile(x, y, z, TileType::Water);
                }
            }
        }
    }
}
```

**Step 5: Run all tests**

Run: `cd core && cargo test`
Expected: ALL PASS

**Step 6: Commit**

```bash
git add core/src/world.rs core/src/lib.rs core/src/terrain.rs
git commit -m "refactor(world): generalize World with WaterSimulator trait via DI"
```

---

### Task 3: CA 시뮬레이션 로직 구현

**Files:**
- Modify: `core/src/water/cellular.rs`

**Step 1: Write failing tests for CA rules**

`core/src/water/cellular.rs` 하단에 테스트 추가:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use crate::tile::TileType;

    fn make_terrain(w: usize, d: usize, h: usize) -> Vec<u8> {
        vec![TileType::Air as u8; w * d * h]
    }

    fn set_terrain(terrain: &mut [u8], w: usize, d: usize, x: usize, y: usize, z: usize, tile: TileType) {
        terrain[x + y * w + z * w * d] = tile as u8;
    }

    #[test]
    fn water_falls_down() {
        let (w, d, h) = (4, 4, 4);
        let mut state = WaterState::new(w, d, h);
        let terrain = make_terrain(w, d, h);
        let mut sim = CellularWaterSimulator::new();

        state.set(1, 1, 3, WaterCell { level: 8, is_source: false });
        sim.tick(&mut state, &terrain);

        assert_eq!(state.get(1, 1, 3).level, 0, "원래 위치는 비어야 함");
        assert_eq!(state.get(1, 1, 2).level, 8, "아래로 이동해야 함");
    }

    #[test]
    fn water_stops_on_solid() {
        let (w, d, h) = (4, 4, 4);
        let mut state = WaterState::new(w, d, h);
        let mut terrain = make_terrain(w, d, h);
        let mut sim = CellularWaterSimulator::new();

        set_terrain(&mut terrain, w, d, 1, 1, 0, TileType::Stone);
        state.set(1, 1, 1, WaterCell { level: 8, is_source: false });
        sim.tick(&mut state, &terrain);

        assert_eq!(state.get(1, 1, 1).level, 8, "고체 위에서 멈춰야 함");
    }

    #[test]
    fn water_spreads_horizontally() {
        let (w, d, h) = (4, 4, 4);
        let mut state = WaterState::new(w, d, h);
        let mut terrain = make_terrain(w, d, h);
        let mut sim = CellularWaterSimulator::new();

        // 바닥을 전부 고체로
        for y in 0..d {
            for x in 0..w {
                set_terrain(&mut terrain, w, d, x, y, 0, TileType::Stone);
            }
        }
        state.set(2, 2, 1, WaterCell { level: 8, is_source: false });

        sim.tick(&mut state, &terrain);

        // 중앙 level 감소, 이웃 중 일부에 물 분배
        let center = state.get(2, 2, 1).level;
        let neighbors_total: u8 = [(1,2),(3,2),(2,1),(2,3)].iter()
            .map(|&(nx, ny)| state.get(nx, ny, 1).level)
            .sum();
        assert!(center < 8, "중앙은 분배 후 줄어야 함");
        assert!(neighbors_total > 0, "이웃에 물이 분배되어야 함");
    }

    #[test]
    fn source_replenishes_level() {
        let (w, d, h) = (4, 4, 4);
        let mut state = WaterState::new(w, d, h);
        let mut terrain = make_terrain(w, d, h);
        let mut sim = CellularWaterSimulator::new();

        for y in 0..d {
            for x in 0..w {
                set_terrain(&mut terrain, w, d, x, y, 0, TileType::Stone);
            }
        }
        state.set(2, 2, 1, WaterCell { level: 8, is_source: true });

        sim.tick(&mut state, &terrain);

        assert_eq!(state.get(2, 2, 1).level, 8, "수원은 level 유지");
        assert!(state.get(2, 2, 1).is_source, "수원 플래그 유지");
    }
}
```

**Step 2: Run test to verify it fails**

Run: `cd core && cargo test cellular::tests`
Expected: `water_falls_down` FAIL — tick은 빈 구현

**Step 3: Implement CA tick logic**

`core/src/water/cellular.rs`:

```rust
use super::{WaterCell, WaterSimulator, WaterState};
use crate::tile::TileType;

pub struct CellularWaterSimulator;

impl CellularWaterSimulator {
    pub fn new() -> Self {
        Self
    }

    fn is_solid(terrain: &[u8], idx: usize) -> bool {
        let tile = terrain[idx];
        tile != TileType::Air as u8 && tile != TileType::Water as u8
    }
}

impl WaterSimulator for CellularWaterSimulator {
    fn tick(&mut self, state: &mut WaterState, terrain: &[u8]) {
        let w = state.width();
        let d = state.depth();
        let h = state.height();
        let mut next = state.snapshot_cells();

        // Top-to-bottom iteration for gravity
        for z in (0..h).rev() {
            for y in 0..d {
                for x in 0..w {
                    let idx = x + y * w + z * w * d;
                    let cell = next[idx];
                    if cell.level == 0 { continue; }

                    // 1. Fall down
                    if z > 0 {
                        let below_idx = x + y * w + (z - 1) * w * d;
                        if !Self::is_solid(terrain, below_idx) && next[below_idx].level < 8 {
                            let space = 8 - next[below_idx].level;
                            let transfer = cell.level.min(space);
                            next[below_idx].level += transfer;
                            next[idx].level -= transfer;
                            if next[idx].level == 0 && !cell.is_source { continue; }
                        }
                    }

                    // 2. Spread horizontally
                    if next[idx].level > 0 {
                        let neighbors: [(isize, isize); 4] = [(-1,0),(1,0),(0,-1),(0,1)];
                        let mut valid: Vec<usize> = Vec::new();
                        for (dx, dy) in neighbors {
                            let nx = x as isize + dx;
                            let ny = y as isize + dy;
                            if nx < 0 || nx >= w as isize || ny < 0 || ny >= d as isize { continue; }
                            let nidx = nx as usize + ny as usize * w + z * w * d;
                            if Self::is_solid(terrain, nidx) { continue; }
                            if next[nidx].level < next[idx].level {
                                valid.push(nidx);
                            }
                        }
                        if !valid.is_empty() {
                            let current_level = next[idx].level;
                            let total_cells = valid.len() as u8 + 1;
                            let total_water: u8 = current_level + valid.iter()
                                .map(|&ni| next[ni].level)
                                .sum::<u8>();
                            let base = total_water / total_cells;
                            let remainder = total_water % total_cells;
                            next[idx].level = base + if remainder > 0 { 1 } else { 0 };
                            for (i, &ni) in valid.iter().enumerate() {
                                next[ni].level = base + if (i as u8 + 1) < remainder { 1 } else { 0 };
                            }
                        }
                    }

                    // 3. Source replenishment
                    if cell.is_source {
                        next[idx].level = 8;
                        next[idx].is_source = true;
                    }
                }
            }
        }

        state.apply_cells(next);
    }

    fn place_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize, level: u8) {
        state.set(x, y, z, WaterCell { level, is_source: false });
    }

    fn remove_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize) {
        state.set(x, y, z, WaterCell::EMPTY);
    }
}
```

`core/src/water/mod.rs`에 `snapshot_cells`/`apply_cells` 메서드 추가:

```rust
// WaterState impl에 추가
pub fn snapshot_cells(&self) -> Vec<WaterCell> {
    self.cells.clone()
}

pub fn apply_cells(&mut self, cells: Vec<WaterCell>) {
    self.cells = cells;
}
```

**Step 4: Run tests**

Run: `cd core && cargo test`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add core/src/water/cellular.rs core/src/water/mod.rs
git commit -m "feat(water): implement cellular automata water simulation"
```

---

### Task 4: 강 생성 — terrain.rs 확장

**Files:**
- Modify: `core/src/terrain.rs`

**Step 1: Write the test**

`core/src/terrain.rs` 하단에 테스트:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use crate::water::cellular::CellularWaterSimulator;

    #[test]
    fn generate_terrain_produces_water_in_low_areas() {
        let mut world = World::new(32, 32, 16, CellularWaterSimulator::new());
        generate_terrain(&mut world, 42);

        // WATER_LEVEL 이하에 물이 존재해야 함
        let mut has_water = false;
        for y in 0..32 {
            for x in 0..32 {
                for z in 0..=WATER_LEVEL {
                    if world.water().get(x, y, z).level > 0 || world.get_tile(x, y, z) == TileType::Water as u8 {
                        has_water = true;
                    }
                }
            }
        }
        assert!(has_water, "낮은 지대에 물이 있어야 함");
    }

    #[test]
    fn generate_terrain_rivers_flow_downhill() {
        let mut world = World::new(32, 32, 16, CellularWaterSimulator::new());
        generate_terrain(&mut world, 42);

        // 강 수원 위치(높은 곳)에서 아래쪽으로 물이 있어야 함
        let mut high_water = 0;
        let mut low_water = 0;
        for y in 0..32 {
            for x in 0..32 {
                for z in 0..16 {
                    if world.water().get(x, y, z).level > 0 {
                        if z > WATER_LEVEL { high_water += 1; }
                        else { low_water += 1; }
                    }
                }
            }
        }
        assert!(low_water >= high_water, "물은 낮은 곳에 더 많아야 함");
    }
}
```

**Step 2: Run test to verify it fails**

Run: `cd core && cargo test terrain::tests`
Expected: FAIL — 강 생성 로직 아직 없음

**Step 3: Implement river generation**

`core/src/terrain.rs`:

```rust
use noise::{Fbm, MultiFractal, NoiseFn, Perlin};

use crate::tile::TileType;
use crate::water::WaterSimulator;
use crate::world::World;

const WATER_LEVEL: usize = 8;
const NOISE_SCALE: f64 = 0.03;
const RIVER_SOURCE_COUNT: usize = 3;

pub fn generate_terrain<S: WaterSimulator>(world: &mut World<S>, seed: u32) {
    let fbm = Fbm::<Perlin>::new(seed)
        .set_octaves(6)
        .set_frequency(NOISE_SCALE);

    let width = world.width();
    let depth = world.depth();
    let height = world.height();

    let mut surface_map = vec![0usize; width * depth];

    for y in 0..depth {
        for x in 0..width {
            let noise_val = fbm.get([x as f64, y as f64]);
            let normalized = ((noise_val + 1.0) / 2.0).clamp(0.0, 1.0);
            let surface_z = (normalized * (height as f64 * 0.6)) as usize + 2;
            let surface_z = surface_z.min(height - 1);
            surface_map[x + y * width] = surface_z;

            for z in 0..=surface_z {
                let tile = if z < surface_z.saturating_sub(3) {
                    TileType::Stone
                } else if z < surface_z {
                    TileType::Dirt
                } else if surface_z <= WATER_LEVEL {
                    TileType::Sand
                } else {
                    TileType::Grass
                };
                world.set_tile(x, y, z, tile);
            }

            // 기존 해수면 물 채우기
            if surface_z < WATER_LEVEL {
                for z in (surface_z + 1)..=WATER_LEVEL {
                    world.set_tile(x, y, z, TileType::Water);
                    world.place_water(x, y, z, 8);
                }
            }
        }
    }

    // 강 생성: 높은 지점에서 수원 배치 → CA 안정화
    generate_rivers(world, &surface_map, width, depth, seed);
}

fn generate_rivers<S: WaterSimulator>(
    world: &mut World<S>,
    surface_map: &[usize],
    width: usize,
    depth: usize,
    seed: u32,
) {
    // 높은 지점 찾기 (상위 25%)
    let mut heights: Vec<(usize, usize, usize)> = Vec::new();
    for y in 0..depth {
        for x in 0..width {
            let sz = surface_map[x + y * width];
            heights.push((x, y, sz));
        }
    }
    heights.sort_by(|a, b| b.2.cmp(&a.2));

    let threshold = heights.len() / 4;
    let candidates = &heights[..threshold.max(1)];

    // seed 기반으로 수원 선택 (간단한 해싱)
    let mut sources = Vec::new();
    for i in 0..RIVER_SOURCE_COUNT.min(candidates.len()) {
        let pick = ((seed as usize).wrapping_mul(31).wrapping_add(i * 97)) % candidates.len();
        let (x, y, sz) = candidates[pick];
        let source_z = (sz + 1).min(world.height() - 1);
        sources.push((x, y, source_z));
    }

    // 수원 배치 (is_source=true)
    for &(x, y, z) in &sources {
        world.place_water_source(x, y, z, 8);
    }

    // CA 안정화
    let stabilization_ticks = width * depth / 4;
    for _ in 0..stabilization_ticks {
        world.tick_water();
    }

    // 수원 플래그 제거
    world.clear_water_sources();
}
```

`core/src/world.rs`에 `place_water_source`와 `clear_water_sources` 추가:

```rust
// World impl에 추가
pub fn place_water_source(&mut self, x: usize, y: usize, z: usize, level: u8) {
    self.water.set(x, y, z, crate::water::WaterCell { level, is_source: true });
    self.water.sync_levels_cache();
}

pub fn clear_water_sources(&mut self) {
    self.water.clear_sources();
    self.water.sync_levels_cache();
}
```

`core/src/water/mod.rs`의 `WaterState`에 `clear_sources` 추가:

```rust
pub fn clear_sources(&mut self) {
    for cell in &mut self.cells {
        cell.is_source = false;
    }
}
```

**Step 4: Run tests**

Run: `cd core && cargo test`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add core/src/terrain.rs core/src/world.rs core/src/water/mod.rs
git commit -m "feat(terrain): add river generation using CA water simulation"
```

---

### Task 5: TypeScript — WaterData entity

**Files:**
- Create: `src/entities/water/model/water-data.ts`
- Create: `src/entities/water/index.ts`

**Step 1: Write the test (manual verification)**

이 프로젝트에는 TS 테스트 러너가 없으므로 타입 체크로 검증.

**Step 2: Implement WaterData**

`src/entities/water/model/water-data.ts`:

```typescript
const SOURCE_BIT = 0x80;
const LEVEL_MASK = 0x7f;

export class WaterData {
	readonly width: number;
	readonly depth: number;
	readonly height: number;
	private levels: Uint8Array;

	constructor(width: number, depth: number, height: number, levels: Uint8Array) {
		this.width = width;
		this.depth = depth;
		this.height = height;
		this.levels = levels;
	}

	private index(x: number, y: number, z: number): number {
		return x + y * this.width + z * this.width * this.depth;
	}

	getLevel(x: number, y: number, z: number): number {
		return this.levels[this.index(x, y, z)] & LEVEL_MASK;
	}

	isSource(x: number, y: number, z: number): boolean {
		return (this.levels[this.index(x, y, z)] & SOURCE_BIT) !== 0;
	}

	updateLevels(levels: Uint8Array): void {
		this.levels = levels;
	}
}
```

`src/entities/water/index.ts`:

```typescript
export { WaterData } from "./model/water-data";
```

**Step 3: Run typecheck**

Run: `npx tsc -b`
Expected: PASS

**Step 4: Commit**

```bash
git add src/entities/water/
git commit -m "feat(entities): add WaterData entity for water level access"
```

---

### Task 6: GamePage — tick 루프 & WaterData 연결

**Files:**
- Modify: `src/pages/game/ui/GamePage.tsx`

**Step 1: Update GamePage to create WaterData and tick loop**

```typescript
// 기존 import에 추가
import {
	// 기존 것들...
	tick_water,
	water_levels_len,
	water_levels_ptr,
} from "../../../../core/build/game_core";
import { WaterData } from "@/entities/water";

const TICK_INTERVAL_MS = 200;

// useMemo 내부에서 WaterData도 생성
const waterData = useMemo(() => {
    if (!isSuccess || !wasmOutput) return null;
    const ptr = water_levels_ptr();
    const len = water_levels_len();
    const levels = new Uint8Array(wasmOutput.memory.buffer, ptr, len);
    return new WaterData(world!.width, world!.depth, world!.height, levels);
}, [isSuccess, wasmOutput, world]);

// tick 루프 useEffect 추가
useEffect(() => {
    if (!wasmOutput || !waterData) return;
    const interval = setInterval(() => {
        tick_water();
        const ptr = water_levels_ptr();
        const len = water_levels_len();
        const levels = new Uint8Array(wasmOutput.memory.buffer, ptr, len);
        waterData.updateLevels(levels);
    }, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
}, [wasmOutput, waterData]);

// IsometricCanvas에 waterData prop 전달
<IsometricCanvas world={world} waterData={waterData} width={...} height={...} />
```

**Step 2: Run typecheck**

Run: `npx tsc -b`
Expected: FAIL — `IsometricCanvas`가 `waterData` prop을 아직 받지 않음 (Task 7에서 해결)

**Step 3: Commit (WIP — Task 7과 함께 완성)**

이 단계는 Task 7 완료 후 함께 커밋.

---

### Task 7: IsometricCanvas — level 기반 렌더링

**Files:**
- Modify: `src/features/terrain-renderer/ui/IsometricCanvas.tsx`
- Modify: `src/features/terrain-renderer/index.ts`

**Step 1: Update IsometricCanvas props and rendering**

`IsometricCanvas.tsx` 수정 사항:

1. Props에 `waterData` 추가 (optional — WaterData | null)
2. `drawTile`을 level 인식하도록 수정 — 물 타일은 level에 비례한 높이로 그림
3. 렌더 루프에서 water level 참조

```typescript
import { WaterData } from "@/entities/water";

interface IsometricCanvasProps {
    world: WorldData;
    waterData: WaterData | null;
    width: number;
    height: number;
}

// drawTile에 level 파라미터 추가
const drawTile = (
    ctx: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    tileType: number,
    level: number, // 0~8
): void => {
    const faces = getTileFaces(tileType);
    if (!faces) return;

    const hw = TILE_WIDTH / 2;
    const hh = TILE_HEIGHT / 2;
    const tileHeight = (level / 8) * TILE_DEPTH;
    const yOffset = TILE_DEPTH - tileHeight;

    // Top face — shifted down by yOffset
    ctx.fillStyle = faces.top;
    ctx.beginPath();
    ctx.moveTo(sx, sy - hh + yOffset);
    ctx.lineTo(sx + hw, sy + yOffset);
    ctx.lineTo(sx, sy + hh + yOffset);
    ctx.lineTo(sx - hw, sy + yOffset);
    ctx.closePath();
    ctx.fill();

    // Left face — height = tileHeight
    ctx.fillStyle = faces.left;
    ctx.beginPath();
    ctx.moveTo(sx - hw, sy + yOffset);
    ctx.lineTo(sx, sy + hh + yOffset);
    ctx.lineTo(sx, sy + hh + TILE_DEPTH);
    ctx.lineTo(sx - hw, sy + TILE_DEPTH);
    ctx.closePath();
    ctx.fill();

    // Right face — height = tileHeight
    ctx.fillStyle = faces.right;
    ctx.beginPath();
    ctx.moveTo(sx + hw, sy + yOffset);
    ctx.lineTo(sx, sy + hh + yOffset);
    ctx.lineTo(sx, sy + hh + TILE_DEPTH);
    ctx.lineTo(sx + hw, sy + TILE_DEPTH);
    ctx.closePath();
    ctx.fill();
};

// 렌더 루프에서:
for (let z = 0; z < world.height; z++) {
    for (let y = 0; y < world.depth; y++) {
        for (let x = 0; x < world.width; x++) {
            const tile = world.getTile(x, y, z);
            const waterLevel = waterData?.getLevel(x, y, z) ?? 0;

            if (tile === TileType.Air && waterLevel === 0) continue;
            if (isOccluded(world, x, y, z)) continue;

            const sx = toScreenX(x, y);
            const sy = toScreenY(x, y, z);

            // 고체 타일
            if (tile !== TileType.Air && tile !== TileType.Water) {
                drawTile(ctx, sx, sy, tile, 8);
            }

            // 물 렌더링 (Water 타일이거나 water level이 있는 경우)
            if (waterLevel > 0) {
                drawTile(ctx, sx, sy, TileType.Water, waterLevel);
            }
        }
    }
}
```

**Step 2: Run typecheck & lint**

Run: `npx tsc -b && yarn lint`
Expected: PASS

**Step 3: Commit (Task 6 + Task 7)**

```bash
git add src/pages/game/ui/GamePage.tsx src/features/terrain-renderer/ui/IsometricCanvas.tsx
git commit -m "feat: integrate water simulation with game loop and level-based rendering"
```

---

### Task 8: WASM 빌드 & 통합 테스트

**Files:**
- No new files

**Step 1: Build WASM**

Run: `cd core && wasm-pack build --target web --out-dir build`
Expected: 빌드 성공

**Step 2: Run dev server**

Run: `yarn dev`
Expected: 브라우저에서 지형 + 강/물 렌더링 확인

**Step 3: Run typecheck & lint**

Run: `npx tsc -b && yarn lint`
Expected: PASS

**Step 4: Commit**

```bash
git add core/build/
git commit -m "chore: rebuild WASM with water simulation support"
```
