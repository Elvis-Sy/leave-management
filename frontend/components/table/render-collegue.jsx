import { Avatar } from "@nextui-org/react";
import React from "react";



export const RenderCell = ({ user, columnKey }) => {

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "photo":
      return (
        <div className="p-1">
            <Avatar    
                src={`http://localhost:5000/${user.photo}`}
            />
        </div>
      );
    case "nom":
      return (
        <div className="hidden md:table-cell">
          {user.name}
        </div>
      );
    case "poste":
      return (
        <div className="hidden md:table-cell">
          <div>
            <span>{user.poste}</span>
          </div>
          <div>
            <span>{user.Etablissement}</span>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};