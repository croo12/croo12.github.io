import type React from "react";
import { layout, spacing } from "@/shared/theme";
import { Body, Title } from "@/shared/ui";

export const BlogPage: React.FC = () => {
	return (
		<div
			style={{
				maxWidth: layout.maxWidthNarrow,
				margin: "0 auto",
				padding: `${spacing["2xl"]} ${spacing.md}`,
			}}
		>
			<Title>Blog</Title>
			<Body>Coming soon. Stay tuned!</Body>
		</div>
	);
};
