
import { Tooltip } from "@nextui-org/react";
import React from "react";
import { InfoIcon } from '../icons/accounts/info-icon'
import Image from "next/image";

export const RenderCell = ({ user, columnKey, onOpen, setId }) => {

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "infoD":
      return (
        <div className="p-2">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold">Congé</h3>
                    <span className="text-gray-500 font-medium">{user.type}</span>
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
    case "dateConfirmation":
    return (
        <div className=" hidden lg:table-cell">
            <p>{user.dateConf || '-/-'}</p>
        </div>
    );
    case "nbr":
    return (
        <div className=" hidden lg:table-cell">
            <p className="font-semibold text-medium">{user.nbrJrs} <span className='font-normal text-sm'>jours</span></p>
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
    case "statut":
    return (
        <div className={`flex items-center gap-1 ${user.statut == "Refusee" ? "text-[#fa5252]" : user.statut == "Approuvee" ? "text-[#40c057]" : "text-gray-500"}`}>
            <span>{user.statut}</span>
            <Image src={`${user.statut == "Refusee" ? "/invalid.png" : user.statut == "Approuvee" ? "/valid.png" : user.statut == "Annulee" ? "/back.png" : "/wait.png"}`} alt="typeConge" width={20} height={20}/>
        </div>
    );
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div className={user.statut == "Refusee" ? '' : 'hidden'}>
            <Tooltip content={
              <div className="p-2"><span className="font-semibold">Motif: </span>{user.motif}</div>
            } color="primary">
                <button>
                  <InfoIcon size={20} fill="#fa5252" />
                </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};

