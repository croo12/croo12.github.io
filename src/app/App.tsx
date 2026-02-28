import type React from "react";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { AboutPage } from "@/pages/about";
import { BlogPage } from "@/pages/blog";
import { GamePage } from "@/pages/game";

const navLinkStyle = ({
	isActive,
}: {
	isActive: boolean;
}): React.CSSProperties => ({
	color: isActive ? "#4CAF50" : "#aaaaaa",
	textDecoration: "none",
	fontSize: "16px",
	fontWeight: isActive ? "bold" : "normal",
	padding: "8px 16px",
});

export const App: React.FC = () => {
	return (
		<HashRouter>
			<nav
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "8px",
					padding: "16px",
					borderBottom: "1px solid #333",
					marginBottom: "24px",
				}}
			>
				<NavLink to="/" end style={navLinkStyle}>
					Game
				</NavLink>
				<NavLink to="/blog" style={navLinkStyle}>
					Blog
				</NavLink>
				<NavLink to="/about" style={navLinkStyle}>
					About
				</NavLink>
			</nav>
			<Routes>
				<Route path="/" element={<GamePage />} />
				<Route path="/blog" element={<BlogPage />} />
				<Route path="/about" element={<AboutPage />} />
			</Routes>
		</HashRouter>
	);
};
