"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export const CollapseItems = React.memo(({ icon, items, title, isActive, role }) => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Vérifie si nous sommes dans le navigateur et récupère le rôle
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("role"));
    }
  }, []);

  // Classe pour le titre de l'accordéon, calculée une seule fois
  const accordionTriggerClass = useMemo(() => {
    return clsx(
      isActive
        ? "bg-primary-100 [&_svg_path]:fill-primary-500"
        : "hover:bg-default-100",
      "py-0 min-h-[44px] rounded-xl active:scale-[0.98] transition-transform px-3.5 flex gap-2 w-full min-h-[44px] h-full items-center cursor-pointer transition-all duration-150 active:scale-[0.98]"
    );
  }, [isActive]);

  // Retourne null uniquement après l'initialisation des hooks pour éviter l'erreur de hooks conditionnels
  if (userRole !== role) {
    return null;
  }

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger: accordionTriggerClass,
            title: "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            {items.map((item, index) => {
              const itemClass = clsx(
                pathname === item.link
                  ? "text-primary-500"
                  : "hover:bg-default-100"
              );
              return (
                <NextLink
                  key={index}
                  href={item.link}
                  className="w-full flex pl-28 text-default-500 hover:text-default-900 transition-colors"
                >
                  <span className={itemClass}>{item.label}</span>
                </NextLink>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
});