export interface Camera {
	x: number;
	y: number;
	zoom: number;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const PAN_SPEED = 4;

export const createCamera = (x = 0, y = 0): Camera => ({
	x,
	y,
	zoom: 1.0,
});

export const panCamera = (
	camera: Camera,
	keys: ReadonlySet<string>,
): Camera => {
	let dx = 0;
	let dy = 0;
	const speed = PAN_SPEED / camera.zoom;

	if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= speed;
	if (keys.has("KeyS") || keys.has("ArrowDown")) dy += speed;
	if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= speed;
	if (keys.has("KeyD") || keys.has("ArrowRight")) dx += speed;

	if (dx === 0 && dy === 0) return camera;
	return { ...camera, x: camera.x + dx, y: camera.y + dy };
};

export const zoomCamera = (camera: Camera, delta: number): Camera => {
	const factor = delta > 0 ? 0.9 : 1.1;
	const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.zoom * factor));
	return { ...camera, zoom };
};
