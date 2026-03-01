import "./text.css";

interface SubTitleProps {
	children: React.ReactNode;
}

export const SubTitle: React.FC<SubTitleProps> = ({ children }) => {
	return <h2 className="sub-title">{children}</h2>;
};
