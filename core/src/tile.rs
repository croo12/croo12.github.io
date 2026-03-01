#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum TileType {
	Air = 0,
	Grass = 1,
	Dirt = 2,
	Stone = 3,
	Water = 4,
	Sand = 5,
}
