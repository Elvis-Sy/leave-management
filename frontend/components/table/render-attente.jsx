
import { User, Tooltip } from "@nextui-org/react";
import React from "react";
import Image from "next/image";

export const RenderCell = ({ user, columnKey, onOpen, setId }) => {

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "infoD":
      return (
        <div className="p-2">
            <div className="flex items-center gap-4">
            <Image src={
                user.type === "Paye" ? "/paye.png" :
                user.type === "Maternite" ? "/maternite.png" :
                user.type === "Paternite" ? "/paternite.png" :
                "/maladie.png"
            } alt="typeConge" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
            <div className="flex flex-col">
                <h3 className="font-semibold text-md">{user.type}</h3>
                <p className="text-xs text-gray-500"><span className="text-sm text-gray-500 font-medium">{user.nbrJrs}</span> jours</p>
            </div>
            </div>
        </div>
      );
    case "dateEnvoi":
      return (
        <div className=" hidden lg:table-cell">
            <p>{user.dateEnvoi}</p>
        </div>
      );
    case "infoDemande":
      return (
        <div className="hidden md:table-cell">
            <User   
                name={user.name}
                description={user.etablissement}
                avatarProps={{
                src: `http://localhost:5000/${user.photo}`
                }}
            />
      </div>
      );
    case "Duree":
      return (
        <div className="hidden md:table-cell ">
            <div className="flex items-center gap-4">
                <div className="p-2 dark:text-white text-md font-bold text-gray-700 border rounded-lg">
                    {user.dateDebut}
                </div>
                <span>-</span>
                <div className="p-2 dark:text-white text-md font-bold text-gray-700 border rounded-lg">
                    {user.dateFin}
                </div>
            </div>
        </div>
      );
    case "actions":
      return (
        <div className="flex items-center gap-4">
          <Tooltip content="Approuver" color="success" showArrow={true}>
            <button onClick={()=>{ setId(user.id); onOpen("AcceptModal") }} className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400/20">
              <Image src="/accept.png" alt="accept" width={25} height={25}/>
            </button>
          </Tooltip>
          <Tooltip content="Refuser" color="danger" showArrow={true}>
            <button onClick={()=>{ setId(user.id); onOpen("RefuseModal") }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]/20">
              <Image src="/reject.png" alt="reject" width={20} height={20}/>
            </button>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
};

