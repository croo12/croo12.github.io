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
		Self {
			width,
			depth,
			height,
			tiles,
			water,
			simulator,
		}
	}

	pub fn width(&self) -> usize {
		self.width
	}

	pub fn depth(&self) -> usize {
		self.depth
	}

	pub fn height(&self) -> usize {
		self.height
	}

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

	pub fn tiles_ptr(&self) -> *const u8 {
		self.tiles.as_ptr()
	}

	pub fn tiles_len(&self) -> usize {
		self.tiles.len()
	}

	pub fn tiles(&self) -> &[u8] {
		&self.tiles
	}

	// Water delegation
	pub fn water(&self) -> &WaterState {
		&self.water
	}

	pub fn tick_water(&mut self) {
		self.simulator.tick(&mut self.water, &self.tiles);
		self.water.sync_levels_cache();
	}

	pub fn place_water(&mut self, x: usize, y: usize, z: usize, level: u8) {
		self.simulator
			.place_water(&mut self.water, x, y, z, level);
		self.water.sync_levels_cache();
	}

	pub fn remove_water(&mut self, x: usize, y: usize, z: usize) {
		self.simulator.remove_water(&mut self.water, x, y, z);
		self.water.sync_levels_cache();
	}

	pub fn place_water_source(&mut self, x: usize, y: usize, z: usize, level: u8) {
		self.water.set(
			x,
			y,
			z,
			crate::water::WaterCell {
				level,
				is_source: true,
			},
		);
		self.water.sync_levels_cache();
	}

	pub fn clear_water_sources(&mut self) {
		self.water.clear_sources();
		self.water.sync_levels_cache();
	}

	pub fn water_levels_ptr(&self) -> *const u8 {
		self.water.levels_ptr()
	}

	pub fn water_levels_len(&self) -> usize {
		self.water.levels_len()
	}
}

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
		world.tick_water();
	}

	#[test]
	fn world_place_and_get_water() {
		let mut world = World::new(4, 4, 4, CellularWaterSimulator::new());
		world.place_water(1, 1, 1, 5);
		let cell = world.water().get(1, 1, 1);
		assert_eq!(cell.level, 5);
	}
}
