use noise::{Fbm, MultiFractal, NoiseFn, Perlin};

use crate::tile::TileType;
use crate::world::World;

const WATER_LEVEL: usize = 8;
const NOISE_SCALE: f64 = 0.03;

pub fn generate_terrain(world: &mut World, seed: u32) {
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
