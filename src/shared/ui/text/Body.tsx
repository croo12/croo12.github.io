import "./text.css";

interface BodyProps {
	children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({ children }) => {
	return <p className="body">{children}</p>;
};
