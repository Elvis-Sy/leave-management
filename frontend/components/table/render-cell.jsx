
import { User, Tooltip } from "@nextui-org/react";
import React from "react";
import { EyeIcon } from "../icons/table/eye-icon";
import { useRouter } from "next/navigation";

export const RenderCell = ({ user, columnKey }) => {

  const router = useRouter();

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "info":
      return (
        <User   
          name={user.name}
          description={user.email}
          avatarProps={{
            src: `http://localhost:5000/${user.photo}`
        }}
        />
      );
    case "matricule":
      return(
        <div className="hidden md:table-cell">
          <span>{user.matricule}</span>
        </div>
      )
    case "nbrSub":
      return (
        <div className="hidden md:table-cell">
          <span className="text-2xl font-semibold">{user.nbrSub}</span> employes
        </div>
      );
    case "poste":
      return (
        <div className="hidden md:table-cell">
          <div>
            <span>{user.poste}</span>
          </div>
          <div>
            <span>{user.etablissement}</span>
          </div>
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Inspecter" color="success">
                <button onClick={()=>router.push(`/managers/${user.id}`)}>
                  <EyeIcon size={20} fill="#40c057" />
                </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};

