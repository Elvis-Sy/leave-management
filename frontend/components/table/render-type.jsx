import { Tooltip } from "@nextui-org/react";
import React from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { DeleteIcon } from "../icons/table/delete-icon"


export const RenderCell = ({ user, columnKey, onOpen, setId }) => {

  const cellValue = user[columnKey];
  switch (columnKey) {
    case "label":
      return (
          <div className="p-2">
            <span>{user.designType}</span>
          </div>
      );
    case "total":
      return (
          <div>
            <span>{user.nbJours}</span>
          </div>
      );
    case "actions":
      return (
        <div className="flex items-center justify-center gap-6 ">
            <div>
                <Tooltip content="Modifier" color="primary">
                <button onClick={()=>{ setId(user.id); onOpen("modifModal")}}>
                    <EditIcon size={20} fill="#1d71b8" />
                </button>
                </Tooltip>
            </div>
            <div>
                <Tooltip content="Supprimer" color="danger">
                <button onClick={()=>{ setId(user.id); onOpen("suppModal") }}>
                    <DeleteIcon size={20} fill="#FF0080" />
                </button>
                </Tooltip>
            </div>
        </div>
      );
    default:
      return cellValue;
  }
};