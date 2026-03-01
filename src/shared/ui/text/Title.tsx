import "./text.css";

interface TitleProps {
	children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children }) => {
	return <h1 className="title">{children}</h1>;
};
