mod terrain;
mod tile;
mod world;

use std::cell::UnsafeCell;
use wasm_bindgen::prelude::*;
use world::World;

struct WorldHolder(UnsafeCell<Option<World>>);

// SAFETY: Wasm is single-threaded, no concurrent access possible.
unsafe impl Sync for WorldHolder {}

static WORLD: WorldHolder = WorldHolder(UnsafeCell::new(None));

fn with_world<T>(f: impl FnOnce(&World) -> T, default: T) -> T {
	unsafe { (*WORLD.0.get()).as_ref().map_or(default, f) }
}

#[wasm_bindgen]
pub fn greet() -> String {
	String::from("Hello from game-core!")
}

#[wasm_bindgen]
pub fn create_world(width: usize, depth: usize, height: usize, seed: u32) {
	let mut w = World::new(width, depth, height);
	terrain::generate_terrain(&mut w, seed);
	unsafe {
		*WORLD.0.get() = Some(w);
	}
}

#[wasm_bindgen]
pub fn world_tiles_ptr() -> *const u8 {
	with_world(|w| w.tiles_ptr(), std::ptr::null())
}

#[wasm_bindgen]
pub fn world_tiles_len() -> usize {
	with_world(|w| w.tiles_len(), 0)
}

#[wasm_bindgen]
pub fn world_width() -> usize {
	with_world(|w| w.width(), 0)
}

#[wasm_bindgen]
pub fn world_depth() -> usize {
	with_world(|w| w.depth(), 0)
}

#[wasm_bindgen]
pub fn world_height() -> usize {
	with_world(|w| w.height(), 0)
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn greet_returns_message() {
		assert_eq!(greet(), "Hello from game-core!");
	}
}
