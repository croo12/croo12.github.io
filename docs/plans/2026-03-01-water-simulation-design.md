# Water Simulation Design

## 목표

1. **지형 생성 시**: 높은 곳에서 낮은 곳으로 흐르는 강/폭포 자동 생성
2. **런타임**: 사용자가 물을 배치하면 낮은 곳으로 흘러내리는 시뮬레이션

## 접근법

Cellular Automata (CA) 기반 시뮬레이션. 교체 가능한 모듈 구조(DI)로 향후 Navier-Stokes 등으로 전환 용이.

## Rust 모듈 구조

```
core/src/
  water/
    mod.rs              # WaterSimulator trait, WaterState, WaterCell
    cellular.rs         # CellularWaterSimulator (CA 구현체)
  world.rs              # World<S: WaterSimulator> — 시뮬레이터를 제네릭으로 소유
  terrain.rs            # 강 생성 시 WaterSimulator 사용
  lib.rs                # WASM API (Composition Root)
```

### 핵심 인터페이스

```rust
pub struct WaterCell {
    pub level: u8,        // 0~8 (TILE_DEPTH와 1:1)
    pub is_source: bool,
}

pub struct WaterState {
    width: usize,
    depth: usize,
    height: usize,
    cells: Vec<WaterCell>,
}

pub trait WaterSimulator {
    fn tick(&mut self, state: &mut WaterState, terrain: &[u8]);
    fn place_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize, level: u8);
    fn remove_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize);
}
```

### DI 구조

- `World<S: WaterSimulator>` — trait bound로 시뮬레이터 주입
- `generate_terrain<S: WaterSimulator>(world: &mut World<S>, seed: u32)` — 시뮬레이터를 매개변수로 받음
- `lib.rs`가 Composition Root — `CellularWaterSimulator::new()`를 여기서만 결정
- 교체 시 `lib.rs` 한 줄 변경으로 완료

### CA 시뮬레이션 규칙

매 tick 모든 물 셀 순회:
1. **낙하**: 바로 아래가 비어있으면 level 전부 이동
2. **수평 분배**: 같은 높이 4방향 이웃 중 level이 낮은 쪽으로 균등 분배
3. **소멸**: level이 0이 되면 셀 제거
4. **수원**: `is_source=true`면 매 tick level을 최대치로 복원

## WASM API

```rust
// 기존
pub fn create_world(width: u32, depth: u32, height: u32, seed: u32);
pub fn world_tiles_ptr() -> *const u8;
pub fn world_tiles_len() -> usize;
pub fn world_width() -> usize;
pub fn world_depth() -> usize;
pub fn world_height() -> usize;

// 추가
pub fn tick_water();
pub fn place_water(x: u32, y: u32, z: u32, level: u8);
pub fn remove_water(x: u32, y: u32, z: u32);
pub fn water_levels_ptr() -> *const u8;
pub fn water_levels_len() -> usize;
```

- u8 packing: 상위 1비트 = is_source, 하위 7비트 = level (0~8)
- `water_levels_ptr()`로 JS에서 제로카피 참조

## 게임 루프

- **시뮬레이션 tick**: `setInterval(tick_water, 200ms)` — 초당 5tick
- **렌더 루프**: `requestAnimationFrame` ~60fps — 매 프레임 최신 water_levels 읽기
- 두 루프는 독립적으로 동작

## 렌더링: 범용 레벨 기반

- 모든 타일이 0~8 level 사용 (TILE_DEPTH=8과 1:1)
- 고체 타일(Grass, Stone 등) → level=8 (꽉 참)
- 물 타일 → level에 비례한 높이로 top/left/right face 그리기
- 투명도: `opacity = 0.3 + (level / 8) * 0.4`
- 수원(is_source)은 밝은 시안으로 구분

## 강 생성 알고리즘

`generate_terrain` 확장:
1. Perlin noise 지형 생성 (기존) + 고체 타일 level=8
2. 높은 지점 N개를 수원(`is_source=true`, `level=8`)으로 선정
3. CA를 `width * depth` tick 시뮬레이션 → 안정화
4. 수원 플래그 제거, 안정화된 WaterState가 초기 상태

## TypeScript 변경

### FSD 배치

```
entities/water/model/water-data.ts   # WaterData 클래스 (u8 래핑, level/isSource 파싱)
entities/water/index.ts              # public API
features/terrain-renderer/ui/IsometricCanvas.tsx  # level 기반 렌더링 추가
pages/game/ui/GamePage.tsx           # WaterData 생성, tick 루프 관리
```

## 설계 원칙

| 원칙 | 적용 |
|------|------|
| DI / 교체 가능 | `WaterSimulator` trait, `lib.rs`가 조립 지점 |
| 범용 레벨 시스템 | 모든 타일 0~8 level, 향후 용암/모래 등 확장 용이 |
| 시뮬/렌더 분리 | tick 200ms vs rAF 60fps 독립 |
| 제로카피 | `water_levels_ptr()`로 WASM 메모리 직접 참조 |
| 단일 엔진 | 강 생성과 런타임 배치 모두 동일 CA 엔진 |
