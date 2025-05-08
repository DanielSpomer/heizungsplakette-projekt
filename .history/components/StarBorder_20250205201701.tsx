import React, { ReactNode } from 'react';
import "./StarBorder.css";

interface StarBorderProps<T extends React.ElementType = 'button'> {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  children?: ReactNode;
}

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...rest
}: StarBorderProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) => {
  const Component = as || 'button';

  return (
    <Component className={`star-border-container ${className}`} {...rest}>
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;