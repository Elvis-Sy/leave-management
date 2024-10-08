"use client"

import Link from "next/link";
import Menu from '../components/Menu'
import Topbar from '../components/Topbar'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

export default function DashboardLayout({ children }) {

  const router = useRouter();
  const [infoUser, setInfoUser] = useState({})

  //controle de la session de connection
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {

        toast.error('Votre session est expiré!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });

        setTimeout(() => {
          router.push('/sign-in'); // Rediriger vers la page de connexion
        }, 3500); 
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le payload
      const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

      if (payload.exp < currentTime) {

        toast.error("Votre session est expirée", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        localStorage.removeItem('token'); // Supprimer le token expiré
        setTimeout(() => {
          router.push('/sign-in'); // Rediriger vers la page de connexion
        }, 3000);
      }

    };

    const id = localStorage.getItem('id');
    getInfo(id);

    checkToken();

    const intervalId = setInterval(() => {
      checkToken();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };

  }, [router]);


  //Info utilisateur
  const getInfo = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employes/${id}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      
      setInfoUser(response.data.info)

    } catch (error) {
      console.log(error.message)
    }
  };

    return (
      <div className="h-screen flex">
        <ToastContainer />
        {/* LEFT SIDE */}
        <div className="w-[16%] md:w-[10%] lg:w-[16%] xl:w-[14%] transition-all duration-500 bg-white">

            {/* Lien vers home */}
            <Link href="/" className="flex justify-center lg:justify-center">
                {/* Logo du site */}
                <img src="/logo.svg" alt="logo" className="z-20" width={63} height={63}/>
            </Link>

            {/* Different menus */}
            <Menu/>

        </div>

        {/* RIGHT SIDE */}
        
        <div className="w-[84%] md:w-[90%] lg:w-[84%] xl:w-[86%] overflow-y-scroll">
            <Topbar infoUser={infoUser}/>
            {children}
        </div>

      </div>
    );
  }