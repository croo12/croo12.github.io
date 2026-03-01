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
