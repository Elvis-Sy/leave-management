import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import { CalendarIcon } from '../icons/calendar-icon'
import { HistoryIcon } from '../icons/historique'
import { ActiveLeaveIcon } from '../icons/actif-conge'

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
              role={'Admin'}
            />

            <SidebarItem
              title="Accueil"
              icon={<HomeIcon />}
              isActive={pathname === "/accueil"}
              href="/accueil"
              role={'Employe'}
            />
            <SidebarMenu title="Pages principales">
              <SidebarItem
                isActive={pathname.startsWith("/managers")}
                title="Managers"
                icon={<AccountsIcon />}
                href="/managers"
                role={'Admin'}
              />
              <SidebarItem
                isActive={pathname.startsWith("/employes")}
                title="Employes"
                icon={<CustomersIcon />}
                href="/employes"
                role={'Admin'}
              />
              <CollapseItems
                icon={<ReportsIcon />}
                items={[{label: "Validées", link: "/demandes/valides"}, {label: "En attente", link: "/demandes/attentes"}]}
                title="Demandes"
                isActive={pathname.startsWith("/demandes")}
                role={'Admin'}
              />
              <SidebarItem
                isActive={pathname === "/reports"}
                title="Historiques"
                icon={<HistoryIcon />}
                role={'Admin'}
              />
              <SidebarItem
                isActive={pathname === "/mesDemandes"}
                title="Mes demandes"
                icon={<ReportsIcon />}
                href="/mesDemandes"
                role={'Employe'}
              />
              <SidebarItem
                isActive={pathname === "/monEquipe"}
                title="Mon equipe"
                icon={<CustomersIcon />}
                href="/monEquipe"
                role={'Employe'}
              />
            </SidebarMenu>

            <SidebarMenu title="Calendrier">
              <SidebarItem
                isActive={pathname === "/calendrier/ferries"}
                title="Jours ferries"
                icon={<CalendarIcon />}
                href="/calendrier/ferries"
                role={'Admin'}
              />
              <SidebarItem
                isActive={pathname === "/calendrier/conges"}
                title="Congés actifs"
                icon={<ActiveLeaveIcon />}
                href="/calendrier/conges"
                role={'Admin'}
              />

              <SidebarItem
                isActive={pathname === "/calendrier/equipe"}
                title="Congés de l'équipe"
                icon={<ActiveLeaveIcon />}
                href="/calendrier/equipe"
                role={'Employe'}
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
