import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const FormTitle = ({ children, className }: Props) => {
  return <h4 className={`text-center text-lg font-medium text-black ${className}`}>{children}</h4>;
};

export default FormTitle;
