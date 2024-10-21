"use client"

import { Layout } from "@/components/layout/layout";
import "@/styles/globals.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

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
          router.push('/login'); // Rediriger vers la page de connexion
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
          router.push('/login'); // Rediriger vers la page de connexion
        }, 3000);
      }

    };

    checkToken();

    const intervalId = setInterval(() => {
      checkToken();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };

  }, [router]);

  return (
    <>
      <ToastContainer />
      <Layout>{children}</Layout>
    </>
  );
}
