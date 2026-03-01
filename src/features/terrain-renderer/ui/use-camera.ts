import { useCallback, useEffect, useRef, useState } from "react";
import {
	type Camera,
	createCamera,
	panCamera,
	zoomCamera,
} from "../model/camera";

const PAN_INTERVAL_MS = 16;

export const useCamera = (
	initialX = 0,
	initialY = 0,
): {
	camera: Camera;
	onWheel: (e: WheelEvent) => void;
} => {
	const [camera, setCamera] = useState(() => createCamera(initialX, initialY));
	const keysRef = useRef(new Set<string>());

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent): void => {
			keysRef.current.add(e.code);
		};
		const handleKeyUp = (e: KeyboardEvent): void => {
			keysRef.current.delete(e.code);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		const interval = setInterval(() => {
			setCamera((prev) => panCamera(prev, keysRef.current));
		}, PAN_INTERVAL_MS);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			clearInterval(interval);
		};
	}, []);

	const onWheel = useCallback((e: WheelEvent) => {
		setCamera((prev) => zoomCamera(prev, e.deltaY));
	}, []);

	return { camera, onWheel };
};
