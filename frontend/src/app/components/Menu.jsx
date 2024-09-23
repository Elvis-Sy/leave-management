"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@nextui-org/react";

const actuel = "admin";

const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/dashboard.png", //accueil.png 
          label: "Dashboard",
          href: "/dashboard/admin",
          visible: ["admin", "manager", "employe"],
        },
        {
          icon: "/manager.png", //manager.png
          label: "Managers",
          href: "/dashboard/manager",
          visible: ["admin"],
        },
        {
          icon: "/employes.png", //employes.png
          label: "Employes",
          href: "/dashboard/employe",
          visible: ["admin", "manager"],
        },
        {
          icon: "/demandes.png", //demandes.png
          label: "Demandes",
          href: "/dashboard/list/demandes",
          visible: ["admin", "manager"],
        },
        {
          icon: "/mydemande.png", //mydemande.png
          label: "Demandes",
          href: "/list/mydemandes",
          visible: ["employe"],
        },
        {
          icon: "/historiques.png", //historiques.png
          label: "Historiques",
          href: "/dashboard/list/historiques",
          visible: ["admin", "manager"],
        },
        {
          icon: "/calendrier.png", //calendrier.png
          label: "Calendrier",
          href: "/dashboard/list/calendrier",
          visible: ["admin", "manager", "employe"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/deconnex.png", //deconnex.png
          label: "Logout",
          href: "/logout",
          visible: ["admin", "manager", "employe"],
        },
      ],
    },
  ];

const Menu =()=> {

  const pathname = usePathname();

  return (
    <div className="text-xm px-4 pb-20 flex flex-col h-[90%] justify-between">
        {menuItems.map(items =>(
            <div key={items.title} className="flex flex-col gap-4">
                <span className="w-full border border-gray-200"></span>

                {/* Verifie le nav approprie pour l'utilisateur actuel */}

                {items.items.filter(i => i.visible.includes(actuel)).map(i=>{

                  const isActive = pathname === i.href;
                  return(
                    <Link href={i.href} key={i.label} className={`flex items-center justify-center lg:justify-start gap-4 py-2 transition-all ${isActive ? "active" : "link group"}`}>
                      <Badge content="5" color="danger" isInvisible={i.label == "Demandes" ? false : true}>
                        <img src={i.icon} alt="" width={25} height={25} className="z-20 max-w-[25px]"/>
                      </Badge>
                      <span className={`absolute font-medium text-transparent -z-20 lg:z-30 ${isActive ? "lg:text-white" : "lg:text-gray-700"} lg:left-12 transition-all`}>{i.label}</span>
                    </Link>
                  )
                })}
            </div>
        ))}
    </div>
  )
}

export default Menu