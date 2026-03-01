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
		let current = state.snapshot_cells();
		let mut next = current.clone();

		// Top-to-bottom iteration for gravity
		for z in (0..h).rev() {
			for y in 0..d {
				for x in 0..w {
					let idx = x + y * w + z * w * d;
					let cell = current[idx];
					if cell.level == 0 {
						continue;
					}

					// 1. Fall down
					if z > 0 {
						let below_idx = x + y * w + (z - 1) * w * d;
						if !Self::is_solid(terrain, below_idx) && next[below_idx].level < 8 {
							let space = 8 - next[below_idx].level;
							let transfer = cell.level.min(space);
							next[below_idx].level += transfer;
							next[idx].level -= transfer;
							if next[idx].level == 0 && !cell.is_source {
								continue;
							}
						}
					}

					// 2. Spread horizontally
					let current_level = next[idx].level;
					if current_level > 0 {
						let neighbors: [(isize, isize); 4] =
							[(-1, 0), (1, 0), (0, -1), (0, 1)];
						let mut valid: Vec<usize> = Vec::new();
						for (dx, dy) in neighbors {
							let nx = x as isize + dx;
							let ny = y as isize + dy;
							if nx < 0 || nx >= w as isize || ny < 0 || ny >= d as isize {
								continue;
							}
							let nidx = nx as usize + ny as usize * w + z * w * d;
							if Self::is_solid(terrain, nidx) {
								continue;
							}
							if current[nidx].level < cell.level {
								valid.push(nidx);
							}
						}
						if !valid.is_empty() {
							let total_cells = valid.len() as u8 + 1;
							let total_water: u8 = current_level
								+ valid.iter().map(|&ni| current[ni].level).sum::<u8>();
							let base = total_water / total_cells;
							let remainder = total_water % total_cells;
							next[idx].level = base + if remainder > 0 { 1 } else { 0 };
							for (i, &ni) in valid.iter().enumerate() {
								next[ni].level =
									base + if (i as u8 + 1) < remainder { 1 } else { 0 };
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
		state.set(
			x,
			y,
			z,
			WaterCell {
				level,
				is_source: false,
			},
		);
	}

	fn remove_water(&mut self, state: &mut WaterState, x: usize, y: usize, z: usize) {
		state.set(x, y, z, WaterCell::EMPTY);
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use crate::tile::TileType;

	fn make_terrain(w: usize, d: usize, h: usize) -> Vec<u8> {
		vec![TileType::Air as u8; w * d * h]
	}

	fn set_terrain(
		terrain: &mut [u8],
		w: usize,
		d: usize,
		x: usize,
		y: usize,
		z: usize,
		tile: TileType,
	) {
		terrain[x + y * w + z * w * d] = tile as u8;
	}

	#[test]
	fn water_falls_down() {
		let (w, d, h) = (4, 4, 4);
		let mut state = WaterState::new(w, d, h);
		let terrain = make_terrain(w, d, h);
		let mut sim = CellularWaterSimulator::new();

		state.set(
			1,
			1,
			3,
			WaterCell {
				level: 8,
				is_source: false,
			},
		);
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
		state.set(
			1,
			1,
			1,
			WaterCell {
				level: 8,
				is_source: false,
			},
		);
		sim.tick(&mut state, &terrain);

		// 고체 아래로 물이 빠지지 않아야 함
		assert_eq!(state.get(1, 1, 0).level, 0, "고체 블록에는 물이 없어야 함");
		// z=1에 물이 남아 있어야 함 (수평 분배로 줄어들 수 있음)
		assert!(state.get(1, 1, 1).level > 0, "고체 위에 물이 남아야 함");
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
		state.set(
			2,
			2,
			1,
			WaterCell {
				level: 8,
				is_source: false,
			},
		);

		sim.tick(&mut state, &terrain);

		// 중앙 level 감소, 이웃 중 일부에 물 분배
		let center = state.get(2, 2, 1).level;
		let neighbors_total: u8 = [(1, 2), (3, 2), (2, 1), (2, 3)]
			.iter()
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
		state.set(
			2,
			2,
			1,
			WaterCell {
				level: 8,
				is_source: true,
			},
		);

		sim.tick(&mut state, &terrain);

		assert_eq!(state.get(2, 2, 1).level, 8, "수원은 level 유지");
		assert!(state.get(2, 2, 1).is_source, "수원 플래그 유지");
	}
}
