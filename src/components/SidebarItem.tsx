import React, { MouseEventHandler } from "react";
import { Link } from "react-router-dom";

interface SideBarItemProps {
  title: string;
  link: string;
  children: React.ReactNode;
  onClick?: Function;
}

const SidebarItem = ({ title, link, children }: SideBarItemProps) => {
  return (
    <Link to={link}>
      <li className={location.pathname === link ? "active-menu" : ""}>
        {children}
        <p>{title}</p>
      </li>
    </Link>
  );
};

export default SidebarItem;
