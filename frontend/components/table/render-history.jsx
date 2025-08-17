

import { Chip } from "@nextui-org/react";
import React from "react";
import moment from 'moment';

export const RenderCell = ({ user, columnKey }) => {

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "responsable":
      return (
        <div className="p-3">
            <p>{user.genre ? user.genre == "M" ? `Mr ${user.responsable}` : `Mme ${user.responsable}` : '-/-'}</p>
        </div>
      );
    case "niveau":
      return (
        <div className="hidden lg:table-cell">
            {user.niveau}
        </div>
      );
    case "date":
      return (
        <div className="hidden xl:table-cell">
            <p>{moment(user.date).format('DD MMMM YYYY')}</p>
        </div>
      );
    case "ancien":
      return (
        <div className="hidden xl:table-cell">
            <p>{user.ancienne}</p>
        </div>
      );
    case "nouveau":
      return (
        <div className="hidden xl:table-cell ">
            <p>{user.nouvelle}</p>
        </div>
      );
    case "statut":
        return (
          <div>
              <Chip variant="flat" size='md' classNames={{content: 'w-[95px] text-center text-white font-medium'}} className={`${user.action == "Refus" ? "bg-[#fa5252]" : user.action == "Approbation" ? "bg-[#40c057]" : "bg-gray-500"}`}>{user.action}</Chip>
          </div>
        );
    default:
      return cellValue;
  }
};

