import type React from "react";

export const AboutPage: React.FC = () => {
	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
			<h1 style={{ color: "#4CAF50", marginBottom: "24px" }}>About</h1>

			<section style={{ marginBottom: "32px" }}>
				<h2 style={{ color: "#e0e0e0", marginBottom: "12px" }}>
					Project Overview
				</h2>
				<p style={{ color: "#aaaaaa", lineHeight: 1.6 }}>
					WebAssembly 기반 웹 게임 프로젝트입니다. React + Vite 프론트엔드에서
					Canvas 기반 게임을 렌더링하며, 네이티브 코드를 .wasm으로 빌드하여
					브라우저에서 실행합니다.
				</p>
			</section>

			<section style={{ marginBottom: "32px" }}>
				<h2 style={{ color: "#e0e0e0", marginBottom: "12px" }}>Tech Stack</h2>
				<ul style={{ color: "#aaaaaa", lineHeight: 2 }}>
					<li>React 19 + TypeScript</li>
					<li>Vite (build tool)</li>
					<li>WebAssembly (Rust / wasm-pack)</li>
					<li>TanStack Query (async state)</li>
					<li>Feature-Sliced Design (architecture)</li>
					<li>Biome (lint & format)</li>
					<li>GitHub Pages (deploy)</li>
				</ul>
			</section>

			<section>
				<h2 style={{ color: "#e0e0e0", marginBottom: "12px" }}>
					FSD Architecture
				</h2>
				<pre
					style={{
						background: "#1e1e1e",
						padding: "16px",
						borderRadius: "8px",
						color: "#aaaaaa",
						overflow: "auto",
						lineHeight: 1.6,
					}}
				>
					{[
						"src/",
						"  app/       # Entry point, router, global styles",
						"  pages/     # Screen-level components",
						"  widgets/   # Composite UI blocks",
						"  features/  # User actions",
						"  entities/  # Domain models",
						"  shared/    # Common utilities, UI, wasm loader",
					].join("\n")}
				</pre>
			</section>
		</div>
	);
};
