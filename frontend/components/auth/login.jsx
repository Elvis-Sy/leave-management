"use client";

import { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input, Modal, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalBody, Button } from '@nextui-org/react';
import { getAttributesToken } from '../../helpers/attributesToken';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { CustomersIcon } from '../icons/sidebar/customers-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState({});
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const formRef = useRef(null);
  const router = useRouter();
  
  axios.defaults.withCredentials = true;

  const toastConfig = useMemo(() => ({
    position: "top-left",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { fontWeight: 500, color: "green" }
  }), []);

  const goManager = useCallback(() => {
    toast.success("Connexion...", toastConfig);
    router.push('/home');
  }, [router, toastConfig]); // Ajout de toastConfig comme dépendance

  const goEmploye = useCallback(() => {
    localStorage.setItem('role', 'Employe');
    toast.success("Connexion...", toastConfig);
    router.push('/accueil');
  }, [router, toastConfig]); // Ajout de toastConfig comme dépendance

  const onLogin = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);

      if (response.data.state === "ok") {
        const { token } = response.data.result;
        const attributes = getAttributesToken(token);
        const { role, employeId } = attributes;

        // Stocker le token et le rôle
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('id', employeId);

        // Redirection selon le rôle
        switch (role) {
          case 'Admin':
            toast.success("Connexion...", toastConfig);
            router.push('/');
            break;
          case 'Employe':
            goEmploye();
            break;
          case 'Manager':
            onOpen();
            break;
          default:
            break;
        }
      } else {
        const type = response.data.message.includes("passe") ? "password" : "email";
        setErrorMessage({ type, message: response.data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.", { ...toastConfig, autoClose: 3000 });
    }
  };

  const handleButtonClick = () => {
    formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
  };

  return (
    <div className='w-fit flex justify-center'>
      <ToastContainer />
      <div className="w-fit">
        <div className="flex flex-col justify-center items-center mb-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt='logo' width={70} height={70}/>
            <h2 className='text-xl font-bold text-bleuspat mb-2'>Authentification</h2>
          </div>
          <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
        </div>
        <form ref={formRef} onKeyDown={(e) => e.key === 'Enter' && handleButtonClick()} onSubmit={handleSubmit(onLogin)} className='flex items-center flex-col w-full flex-wrap gap-4'>
          <div className='flex flex-col w-full items-center'>
            <Input
              isRequired
              label="Email"
              variant="bordered"
              className="max-w-md font-semibold back login"
              classNames={{inputWrapper: 'backdrop-blur-[2px]'}}
              {...register('email', { 
                required: 'Email requis', 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Entrer un email valide'
                }
              })}
              endContent={
                <div className='flex h-full items-center'>
                  <Image src='/maillog.png' alt='mail-icon' width={20} height={20} className='pointer-events-none' />
                </div>
              }
              onChange={() => setErrorMessage({})}
              isInvalid={!!errors.email}
              errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.email ? errors.email.message : ''}</span>}
            />
            {errorMessage.type === "email" && <span className="flex justify-start text-[#f31260] text-xs text-right">{errorMessage.message}</span>}
          </div>

          <div className='flex flex-col w-full items-center'>
            <Input
              isRequired
              type='password'
              label="Mot de passe"
              variant="bordered"
              className="max-w-md font-semibold login group"
              classNames={{inputWrapper: 'backdrop-blur-[2px]'}}
              {...register('password', { required: 'Mot de passe requis' })}
              endContent={
                <div className='flex h-full items-center group-focus-within:hidden'>
                  <Image src='/password.png' alt='password-icon' width={20} height={20} className='pointer-events-none' />
                </div>
              }
              onChange={() => setErrorMessage({})}
              isInvalid={!!errors.password}
              errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.password ? errors.password.message : ''}</span>}
            />
            {errorMessage.type === "password" && <span className="flex justify-start text-[#f31260] text-xs text-right">{errorMessage.message}</span>}
          </div>
        </form>

        <div className="flex flex-col w-full pr-24">
          <div className='flex my-4 mr-1 justify-end'>
            <span className='text-xs text-gray-500 hover:text-bleuspat/80 font-medium'>Mot de passe oublié ? Contactez le responsable informatique</span>
          </div>
          <button type="button" onClick={handleButtonClick} className='w-fit transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 font-semibold hover:bg-default-50 hover:text-bleuspat'>
            Se connecter
          </button>
        </div>
      </div>

      <div className="hidden md:flex h-full flex-1 relative -left-10">
          <Image
            src="/cover.png"
            alt="Société du Port à gestion Autonome de Toamasina"
            width={350}
            height={350}
            className="self-center rounded-lg -z-10 opacity-80"
          />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top'>
        <ModalContent>
          <ModalHeader className='flex gap-2 bg-bleuspat text-white justify-center'>Se connecter en tant que:</ModalHeader>
          <ModalBody>
            <div className="flex gap-8 items-center justify-between px-10 py-4">
              <Button color='primary' variant='flat' className='font-medium' onPress={goEmploye}><CustomersIcon bgFill='fill-blue-500'/> Employe</Button>
              <Button color='primary' variant='flat' className='font-medium' onPress={goManager}><AccountsIcon bgFill='fill-blue-500'/> Manager</Button> 
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Login;