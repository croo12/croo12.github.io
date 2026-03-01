/**
 * Design tokens for inline styles.
 *
 * CSS에서는 var(--color-accent) 등을 직접 사용하고,
 * JSX 인라인 스타일에서는 이 상수를 import하여 사용한다.
 * 값은 theme.css의 CSS custom properties와 동일하게 유지할 것.
 */

export const colors = {
	bgPrimary: "#121212",
	bgSecondary: "#1a1a1a",
	bgTertiary: "#1e1e1e",
	bgElevated: "#252526",
	textPrimary: "#ffffff",
	textSecondary: "#e0e0e0",
	textMuted: "#aaaaaa",
	textHover: "#cccccc",
	accent: "#4caf50",
	border: "#333333",
	borderHover: "#555555",
} as const;

export const layout = {
	maxWidthContent: "960px",
	maxWidthNarrow: "800px",
	radius: "8px",
} as const;

export const typography = {
	fontPrimary: '"Galmuri11", monospace',
	fontSizeBase: "14px",
	lineHeightBase: 1.6,
} as const;

export const effects = {
	shadowElevated: "0 10px 30px rgba(0,0,0,0.5)",
	transitionFast: "0.15s",
} as const;
