import React from "react";
import { Link } from "react-router-dom";

interface FeatureItemsProps {
  name: string;
  link: string;
  children: React.ReactNode;
}

export function Feature({ name, link, children }: FeatureItemsProps) {
  return (
    <>
      <Link to={link}>
        <div className="stat-jd">
          <span>{name}</span>
          {children}
        </div>
      </Link>
    </>
  );
}
