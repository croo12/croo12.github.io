import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useRef } from "react";
import initGameCore, { greet } from "../../../../core/build/game_core";
import { createWasmLoader } from "@/shared/wasm";
import { colors, effects, layout, spacing, typography } from "@/shared/theme";
import { Body, Title } from "@/shared/ui";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FRAME_INTERVAL_MS = 50;
const ACCENT_RGB = "76, 175, 80"; // colors.accent (#4caf50) in RGB

const gameCoreQueryOptions = createWasmLoader("game-core", initGameCore);

export const GamePage: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { isSuccess } = useQuery(gameCoreQueryOptions);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let op = 0;
		let dir = 0.05;

		const text = isSuccess ? greet() : "Loading Wasm...";

		const interval = setInterval(() => {
			ctx.fillStyle = colors.bgTertiary;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			op += dir;
			if (op > 1 || op < 0) dir = -dir;

			ctx.fillStyle = `rgba(${ACCENT_RGB}, ${op})`;
			ctx.font = `30px ${typography.fontPrimary}`;
			ctx.textAlign = "center";

			ctx.fillText(text, canvas.width / 2, canvas.height / 2);
		}, FRAME_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [isSuccess]);

	return (
		<div
			style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
		>
			<div
				id="game-container"
				style={{
					width: `${CANVAS_WIDTH}px`,
					height: `${CANVAS_HEIGHT}px`,
					backgroundColor: colors.bgTertiary,
					border: `2px solid ${colors.border}`,
					borderRadius: layout.radius,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: effects.shadowElevated,
					marginBottom: spacing.md,
				}}
			>
				<canvas ref={canvasRef} id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
					브라우저가 Canvas를 지원하지 않습니다.
				</canvas>
			</div>

			<div
				className="controls"
				style={{
					padding: spacing.md,
					background: colors.bgElevated,
					borderRadius: layout.radius,
					width: `${CANVAS_WIDTH}px`,
					boxSizing: "border-box",
					textAlign: "center",
				}}
			>
				<Title>My Awesome React Web Game</Title>
				<Body>Powered by React, WebAssembly & FSD Architecture.</Body>
			</div>
		</div>
	);
};
