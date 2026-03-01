import { HashRouter, Route, Routes } from "react-router-dom";
import { AboutPage } from "@/pages/about";
import { BlogPage } from "@/pages/blog";
import { GamePage } from "@/pages/game";
import { Layout } from "@/widgets/layout";

export const App: React.FC = () => {
	return (
		<HashRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<AboutPage />} />
					<Route path="/game" element={<GamePage />} />
					<Route path="/blog" element={<BlogPage />} />
				</Route>
			</Routes>
		</HashRouter>
	);
};
