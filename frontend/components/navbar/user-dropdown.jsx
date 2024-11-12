import {
  Avatar,
  Popover,
  PopoverTrigger,
  NavbarItem,
  PopoverContent,
  User,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import DeconnexionModal from '../modals/deconnexionModal';
import { getAttributesToken } from "@/helpers/attributesToken";

export const UserDropdown = () => {
  const [infoUser, setInfoUser] = useState({});
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Accéder à localStorage uniquement côté client
      setRole(localStorage.getItem('role'));
      const token = localStorage.getItem('token');
      const attribut = getAttributesToken(token);
      
      if (attribut) {
        getInfo(attribut.email);
      } else {
        getInfo(null);
      }
    }
  }, []);

  const getInfo = async (email) => {
    setLoading(true); // Début du chargement des infos
    try {
      const response = await axios.get(`http://localhost:5000/api/employes/info/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setInfoUser(response.data.info);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations :', error.message);
      setInfoUser({}); // Réinitialiser les informations en cas d'erreur
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const formatDate = (date) => {
    const temp = date ? new Date(date) : new Date();
    return format(temp, "d MMMM yyyy", { locale: fr });
  };

  return (
    <Popover placement="left">
      <NavbarItem>
        <PopoverTrigger className="flex items-center gap-2 py-2 px-2 rounded-xl">
          <div className="cursor-pointer">
            <div className="flex flex-col gap-1">
              {infoUser.name && (
                <span className="text-[12px] dark:text-white leading-3 text-center font-medium text-gray-900">
                  {infoUser.name}
                </span>
              )}
              <div className="flex justify-end">
                <span className="text-xs text-white px-2 rounded-full bg-gray-500">{role}</span>
              </div>
            </div>
            <Avatar
              as="button"
              size="md"
              src={infoUser.photo ? `http://localhost:5000/${infoUser.photo}` : `http://localhost:5000/avatar.png`}
            />
          </div>
        </PopoverTrigger>
      </NavbarItem>
      <PopoverContent aria-label="Popover user">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2 justify-between w-[250px] flex-wrap">
            <User
              name={infoUser.name ? infoUser.name : "Utilisateur"}
              description={infoUser.email ? infoUser.email : ""}
              avatarProps={{
                src: `http://localhost:5000/${infoUser.photo}`,
              }}
            />
            <span className="text-[12px] text-white px-2 rounded-full bg-gray-500">{role}</span>
          </div>
          <div>
            {infoUser.poste && <p className="text-sm dark:text-gray-300 text-gray-700 font-medium font-mono">-{infoUser.poste}</p>}
            <p className="text-sm">-Dernière connexion : <span className="font-semibold">{formatDate(infoUser.dernier)}</span></p>
          </div>
          <div className="border-t text-sm border-gray-300 pt-2 flex items-center justify-between">
            <DarkModeSwitch />
            <DeconnexionModal />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};