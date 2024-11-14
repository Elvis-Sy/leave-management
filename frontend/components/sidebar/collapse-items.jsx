"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { getSocket } from "@/helpers/socket"

export const CollapseItems = React.memo(({ icon, items, title, isActive, role }) => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);
  const [nb, setNb] = useState(0)

  // Utilisation de useEffect pour récupérer le rôle une seule fois
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setUserRole(storedRole); 
    }
  }, []);

  useEffect(()=>{
    const socket = getSocket();
    if (socket) {
      socket.on('adminNotif', (data) => {
        if(userRole == "Admin") setNb(data);
      });

      socket.on('managerNotif', (data) => {
        if(userRole == "Manager") setNb(data);
      });

      // Nettoyez l'écouteur à la déconnexion du composant
      return () => {
        socket.off('adminNotif');
        socket.off('managerNotif');
      };
    }
  }, [userRole])

  // Classe pour le titre de l'accordéon, calculée une seule fois
  const accordionTriggerClass = useMemo(() => {
    return clsx(
      isActive
        ? "bg-primary-100 [&_svg_path]:fill-primary-500"
        : "hover:bg-default-100",
      "py-0 min-h-[44px] rounded-xl active:scale-[0.98] transition-transform px-3.5 flex gap-2 w-full min-h-[44px] h-full items-center cursor-pointer transition-all duration-150 active:scale-[0.98]"
    );
  }, [isActive]); // Dépend uniquement de `isActive`

  // Si le rôle n'est pas encore défini, ne rien rendre
  if (userRole === null) return null;

  // Vérification du rôle de l'utilisateur
  if (userRole !== role) {
    return null; // Ne rien afficher si les rôles ne correspondent pas
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
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <span>{icon}</span>
                <span>{title}</span>
              </div>
              {nb > 0 && (
                <span className="flex items-center justify-center font-semibold w-7 h-7 text-[11px] text-white bg-bleuspat/80 rounded-full">
                  {nb > 99 ? "99+" : nb}
                </span>
              )}
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
                  className="w-full flex pl-16 text-default-500 hover:text-default-900 transition-colors"
                >
                  <span className={itemClass}>{item.label} <span className="font-semibold">{item.label === "En attente" && nb > 0 ? ` ( ${nb > 99 ? "99+" : nb} )` : ""}</span></span>
                </NextLink>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

CollapseItems.displayName = "CollapseItems";