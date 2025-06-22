import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Content = ({ children, className }: Props) => {
  return <div className={`max-w-7xl w-full mx-auto ${className}`}>{children}</div>;
};

export default Content;
