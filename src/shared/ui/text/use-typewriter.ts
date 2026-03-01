import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
	text: string;
	speed?: number;
	isActive?: boolean;
	onComplete?: () => void;
}

interface UseTypewriterResult {
	displayedText: string;
	isComplete: boolean;
}

export function useTypewriter({
	text,
	speed = 50,
	isActive = true,
	onComplete,
}: UseTypewriterOptions): UseTypewriterResult {
	const [count, setCount] = useState(0);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	useEffect(() => {
		if (!isActive) return;

		let charCount = 0;
		let lastTime = 0;
		let frameId: number;

		const tick = (time: number): void => {
			if (time - lastTime >= speed) {
				lastTime = time;
				charCount++;
				setCount(charCount);

				if (charCount >= text.length) {
					onCompleteRef.current?.();
					return;
				}
			}
			frameId = requestAnimationFrame(tick);
		};

		frameId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frameId);
	}, [isActive, text.length, speed]);

	return {
		displayedText: text.slice(0, count),
		isComplete: count >= text.length,
	};
}
