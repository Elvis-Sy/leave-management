import { User, Tooltip, Chip, Avatar } from "@nextui-org/react";
import React from "react";
import { EyeIcon } from "../icons/table/eye-icon";
import { format } from "date-fns";
import {fr} from 'date-fns/locale'
import { EditIcon } from "../icons/table/edit-icon";
import { DeleteIcon } from "../icons/table/delete-icon"
import { useRouter } from "next/navigation";
import { ExportIcon } from "@/components/icons/accounts/export-icon";

export const RenderCell = ({ user, columnKey, onOpen, setId }) => {

  const router = useRouter();
  const role = localStorage.getItem('role')

    //Formater la date
    const formatDate = (date)=>{
        const temp = date ? new Date(date) : new Date();
        return format(temp, "dd/MM/yyyy", {locale: fr})
    }

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
    // case "matricule":
    //   return (
    //     <div className="hidden md:table-cell">
    //       <span className="text-left">{user.matricule}</span>
    //     </div>
    //   )
    case "DateEmb":
      return (
        <div className="hidden md:table-cell">
            {user.DateEmb ? 
            <span>{formatDate(user.DateEmb)}</span>
            : (
                <Chip variant="flat" size="lg" className="text-[#e66165] font-medium text-sm">En période d&apos;essai</Chip>
            ) }
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
    case "manager":
      return localStorage.getItem('role') === 'Manager' ? null : (
        <div className="hidden lg:table-cell">
          {user.manager ? (
            <Chip
              variant="flat"
              size="lg"
              avatar={
                <Avatar
                  name={user.manager}
                  src={`http://localhost:5000/${user.photoManager}`}
                />
              }
              className="bg-transparent"
            >
              {user.genre === "M" ? `Mr ${user.manager}` : `Mme ${user.manager}`}
            </Chip>
          ) : (
            <Chip variant="flat" size="lg">-/-</Chip>
          )}
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
           <div>
                <Tooltip content="Inspecter" color="success">
                    {/* <Link href={`/employes/${user.id}`}> */}
                        <button onClick={()=>router.push(`/employes/${user.id}`)}>
                          <EyeIcon size={20} fill="#40c057" />
                        </button>
                    {/* </Link> */}
                </Tooltip>
           </div>
           {role == 'Admin' && (
            <>
              <div>
                  <Tooltip content="Modifier" color="primary">
                  <button onClick={()=>{ setId(user.id); onOpen("modifModal")}}>
                      <EditIcon size={20} fill="#1d71b8" />
                  </button>
                  </Tooltip>
              </div>
              <div>
                  <Tooltip content="Exporter" color="warning">
                  <button onClick={()=>{ setId(user.id); onOpen("excelModal") }}> 
                      <ExportIcon size={20} fill="#e3870d" />
                  </button>
                  </Tooltip>
              </div>
              <div>
                  <Tooltip content="Archiver" color="danger">
                  <button onClick={()=>{ setId(user.id); onOpen("suppModal") }}>
                      <DeleteIcon size={20} fill="#FF0080" />
                  </button>
                  </Tooltip>
              </div>
            </>
          )}
        </div>
      );
    default:
      return cellValue;
  }
};