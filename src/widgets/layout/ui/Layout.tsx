import { NavLink, Outlet } from "react-router-dom";
import "./layout.css";

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
	isActive ? "nav-link nav-link-active" : "nav-link";

export const Layout: React.FC = () => {
	return (
		<div className="layout">
			<nav className="nav">
				<NavLink to="/" end className={navLinkClass}>
					About
				</NavLink>
				<NavLink to="/game" className={navLinkClass}>
					Game
				</NavLink>
				<NavLink to="/blog" className={navLinkClass}>
					Blog
				</NavLink>
			</nav>
			<main className="main">
				<Outlet />
			</main>
		</div>
	);
};
