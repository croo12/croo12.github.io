export const TileType = {
	Air: 0,
	Grass: 1,
	Dirt: 2,
	Stone: 3,
	Water: 4,
	Sand: 5,
} as const;

export type TileTypeValue = (typeof TileType)[keyof typeof TileType];
