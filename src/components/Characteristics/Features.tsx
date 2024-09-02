import React from "react";
import { Link } from "react-router-dom";

interface FeatureItemsProps {
  name: string;
  link: string;
  children: React.ReactNode;
  hasRelation?: boolean;
  relationName?: string;
  relationUri?: string;
}

export function Feature({
  name,
  link,
  children,
  hasRelation = false,
  relationName = "",
  relationUri = "",
}: FeatureItemsProps) {
  return (
    <>
      <Link to={link} state={{ hasRelation, relationName, relationUri }}>
        <div className="stat-jd">
          <span>{name}</span>
          {children}
        </div>
      </Link>
    </>
  );
}
