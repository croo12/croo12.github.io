import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { TileType, type WorldData } from "@/entities/tile";
import {
	TILE_DEPTH,
	TILE_HEIGHT,
	TILE_WIDTH,
	toScreenX,
	toScreenY,
} from "../lib/isometric";
import { getTileFaces } from "../lib/tile-palette";
import { useCamera } from "./use-camera";

interface IsometricCanvasProps {
	world: WorldData;
	width: number;
	height: number;
}

const isOccluded = (
	world: WorldData,
	x: number,
	y: number,
	z: number,
): boolean => {
	const w = world.width;
	const d = world.depth;
	const h = world.height;

	const hasAbove = z + 1 < h && world.getTile(x, y, z + 1) !== TileType.Air;
	const hasFrontLeft =
		y + 1 < d && world.getTile(x, y + 1, z) !== TileType.Air;
	const hasFrontRight =
		x + 1 < w && world.getTile(x + 1, y, z) !== TileType.Air;

	return hasAbove && hasFrontLeft && hasFrontRight;
};

const drawTile = (
	ctx: CanvasRenderingContext2D,
	sx: number,
	sy: number,
	tileType: number,
): void => {
	const faces = getTileFaces(tileType);
	if (!faces) return;

	const hw = TILE_WIDTH / 2;
	const hh = TILE_HEIGHT / 2;

	// Top face
	ctx.fillStyle = faces.top;
	ctx.beginPath();
	ctx.moveTo(sx, sy - hh);
	ctx.lineTo(sx + hw, sy);
	ctx.lineTo(sx, sy + hh);
	ctx.lineTo(sx - hw, sy);
	ctx.closePath();
	ctx.fill();

	// Left face
	ctx.fillStyle = faces.left;
	ctx.beginPath();
	ctx.moveTo(sx - hw, sy);
	ctx.lineTo(sx, sy + hh);
	ctx.lineTo(sx, sy + hh + TILE_DEPTH);
	ctx.lineTo(sx - hw, sy + TILE_DEPTH);
	ctx.closePath();
	ctx.fill();

	// Right face
	ctx.fillStyle = faces.right;
	ctx.beginPath();
	ctx.moveTo(sx + hw, sy);
	ctx.lineTo(sx, sy + hh);
	ctx.lineTo(sx, sy + hh + TILE_DEPTH);
	ctx.lineTo(sx + hw, sy + TILE_DEPTH);
	ctx.closePath();
	ctx.fill();
};

export const IsometricCanvas: React.FC<IsometricCanvasProps> = ({
	world,
	width,
	height,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const centerX = world.width / 2;
	const centerY = world.depth / 2;
	const centerZ = world.height * 0.3;
	const initialCamX = toScreenX(centerX, centerY);
	const initialCamY = toScreenY(centerX, centerY, centerZ);

	const { camera, onWheel } = useCamera(initialCamX, initialCamY);
	const cameraRef = useRef(camera);
	cameraRef.current = camera;

	const render = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const cam = cameraRef.current;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 4);
		ctx.scale(cam.zoom, cam.zoom);
		ctx.translate(-cam.x, -cam.y);

		for (let z = 0; z < world.height; z++) {
			for (let y = 0; y < world.depth; y++) {
				for (let x = 0; x < world.width; x++) {
					const tile = world.getTile(x, y, z);
					if (tile === TileType.Air) continue;
					if (isOccluded(world, x, y, z)) continue;

					const sx = toScreenX(x, y);
					const sy = toScreenY(x, y, z);
					drawTile(ctx, sx, sy, tile);
				}
			}
		}

		ctx.restore();
	}, [world]);

	useEffect(() => {
		let rafId: number;
		const loop = (): void => {
			render();
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(rafId);
	}, [render]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const handleWheel = (e: WheelEvent): void => {
			e.preventDefault();
			onWheel(e);
		};

		canvas.addEventListener("wheel", handleWheel, { passive: false });
		return () => canvas.removeEventListener("wheel", handleWheel);
	}, [onWheel]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{ display: "block", background: "#1a1a2e" }}
		/>
	);
};
