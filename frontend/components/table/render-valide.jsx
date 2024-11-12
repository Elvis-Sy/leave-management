

import { User, Chip, Avatar} from "@nextui-org/react";
import React from "react";
import Image from "next/image";

export const RenderCell = ({ user, columnKey }) => {

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "infoD":
      return (
        <div className="p-2">
            <div className="flex items-center gap-4">
              {/* <img src={
                  user.type === "Paye" ? '/paye.png' :
                  user.type === "Maternite" ? '/maternite.png' :
                  user.type === "Paternite" ? '/paternite.png' :
                  "/maladie.png"
              } alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/> */}
              <div className="flex flex-col">
                  <h3 className="font-semibold text-md">{user.type}</h3>
                  <p className="text-xs text-gray-500"><span className="text-sm text-gray-500 font-medium">{user.nbrJrs}</span> jours</p>
              </div>
            </div>
        </div>
      );
    case "infoDemande":
      return (
        <div className="hidden xl:table-cell">
            <User   
                name={user.name}
                description={user.etablissement}
                avatarProps={{
                src: `http://localhost:5000/${user.photo}`
                }}
            />
        </div>
      );
    case "dateEnvoi":
      return (
        <div className=" hidden lg:table-cell">
            <p>{user.dateEnvoi}</p>
        </div>
      );
    case "dateConfirmation":
      return (
        <div className=" hidden lg:table-cell">
            <p>{user.dateConf}</p>
        </div>
      );
    case "respConfirmation":
      return (
        <div className="hidden xl:table-cell ">
            {user.manager ? <Chip
                variant="flat"
                size="lg"
                avatar={
                    <Avatar
                    name={user.manager}
                    src={`http://localhost:5000/${user.photoManager}`}
                    />
                }
            >
                {user.manager}
            </Chip> :
            <Chip variant="flat" size='lg'>Admin</Chip>}
        </div>
      );
    case "statut":
        return (
            <div className={`flex items-center gap-1 ${user.statut == "Refusee" ? "text-[#fa5252]" : user.statut == "Approuvee" ? "text-[#40c057]" : "text-gray-500"}`}>
                <span>{user.statut}</span>
                <Image src={`${user.statut == "Refusee" ? "/invalid.png" : user.statut == "Approuvee" ? "/valid.png" : "/wait.png"}`} alt="type" width={20} height={20}/>
            </div>
        );
    default:
      return cellValue;
  }
};

