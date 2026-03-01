use crate::tile::TileType;

pub struct World {
	width: usize,
	depth: usize,
	height: usize,
	tiles: Vec<u8>,
}

impl World {
	pub fn new(width: usize, depth: usize, height: usize) -> Self {
		let tiles = vec![TileType::Air as u8; width * depth * height];
		Self {
			width,
			depth,
			height,
			tiles,
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
}
