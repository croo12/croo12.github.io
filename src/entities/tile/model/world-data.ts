import type { TileTypeValue } from "./tile-type";
import { TileType } from "./tile-type";

export class WorldData {
	readonly width: number;
	readonly depth: number;
	readonly height: number;
	private readonly tiles: Uint8Array;

	constructor(
		width: number,
		depth: number,
		height: number,
		tiles: Uint8Array,
	) {
		this.width = width;
		this.depth = depth;
		this.height = height;
		this.tiles = new Uint8Array(tiles);
	}

	getTile(x: number, y: number, z: number): TileTypeValue {
		return this.tiles[
			x + y * this.width + z * this.width * this.depth
		] as TileTypeValue;
	}

	getTopZ(x: number, y: number): number {
		for (let z = this.height - 1; z >= 0; z--) {
			if (this.getTile(x, y, z) !== TileType.Air) {
				return z;
			}
		}
		return 0;
	}
}
