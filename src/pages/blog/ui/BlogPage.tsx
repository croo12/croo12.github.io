import type React from "react";
import { Body, Title } from "@/shared/ui";

export const BlogPage: React.FC = () => {
	return (
		<div
			style={{
				maxWidth: "800px",
				margin: "0 auto",
				padding: "40px 20px",
			}}
		>
			<Title>Blog</Title>
			<Body>Coming soon. Stay tuned!</Body>
		</div>
	);
};
