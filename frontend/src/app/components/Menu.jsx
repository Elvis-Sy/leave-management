"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@nextui-org/react";

const actuel = "admin";

const menuItems = [
    {
      title: "ACCUEIL",
      items: [
        {
          icon: "/dashboard3.png", //accueil.png 
          label: "Dashboard",
          href: "/dashboard/admin",
          visible: ["admin", "manager", "employe"],
        },
      ],
    },
    {
      title: "PAGES",
      items: [
        {
          icon: "/manager4.png", //manager.png
          label: "Managers",
          href: "/dashboard/manager",
          visible: ["admin"],
        },
        {
          icon: "/employe3.png", //employes.png
          label: "Employes",
          href: "/dashboard/employe",
          visible: ["admin", "manager"],
        },
        {
          icon: "/demande4.png", //demandes.png
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
          icon: "/historique3.png", //historiques.png
          label: "Historiques",
          href: "/dashboard/list/historiques",
          visible: ["admin", "manager"],
        },
        {
          icon: "/calendrier4.png", //calendrier.png
          label: "Calendrier",
          href: "/dashboard/list/calendrier",
          visible: ["admin", "manager", "employe"],
        },
      ],
    },
  ];

const Menu =()=> {

  const pathname = usePathname();

  return (
    <div className="pt-4 px-4 h-[90%] border-t-2 border-gray-200">
        {menuItems.map(items =>(
            <div key={items.title} className="flex flex-col gap-4 py-2">
                <span className="hidden lg:block text-gray-500 font-normal">{items.title}</span>

                {/* Verifie le nav approprie pour l'utilisateur actuel */}

                {items.items.filter(i => i.visible.includes(actuel)).map(i=>{

                  const isActive = pathname === i.href;
                  return(
                    <Link href={i.href} key={i.label} className={`flex items-center justify-center lg:justify-start gap-4 py-2 transition-all ${isActive ? "active" : "link group"}`}>
                      <Badge content="5" color="danger" isInvisible={i.label == "Demandes" ? false : true} className="z-20">
                        <img src={i.icon} alt="" width={30} height={30} className="z-20 max-w-[30px]"/>
                      </Badge>
                      <span className={`absolute font-medium text-transparent -z-20 lg:z-30 ${isActive ? "lg:text-white" : "lg:text-gray-700"} lg:left-14 transition-all`}>{i.label}</span>
                    </Link>
                  )
                })}
            </div>
        ))}
    </div>
  )
}

export default Menu