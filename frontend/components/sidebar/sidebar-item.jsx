import NextLink from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { useSidebarContext } from "../layout/layout-context";
import clsx from "clsx";

// Composant optimisé avec React.memo
export const SidebarItem = React.memo(({ icon, title, isActive, href = "", role }) => {
  const { collapsed, setCollapsed } = useSidebarContext();
  const [userRole, setUserRole] = useState(""); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem("role"));
    }
  }, []);

  // Fonction de gestion du clic
  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed();
    }
  };

  // Vérification de la visibilité de l'élément
  const isVisible = role.includes(userRole);

  // Classes conditionnelles optimisées
  const itemClasses = clsx(
    isActive
      ? "bg-primary-100 [&_svg_path]:fill-primary-500"
      : "hover:bg-default-100",
    "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]"
  );

  if (!isVisible) return null;

  return (
    <NextLink href={href} className="text-default-900 active:bg-none max-w-full">
      <div className={itemClasses} onClick={handleClick}>
        {icon}
        <span className="text-default-900">{title}</span>
      </div>
    </NextLink>
  );
});

SidebarItem.displayName = "SidebarItem";