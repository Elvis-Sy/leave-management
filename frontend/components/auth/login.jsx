"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@nextui-org/react'
import {getAttributesToken} from '../../helpers/attributesToken'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const Login =()=> {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState({});

  const formRef = useRef(null);
  const router = useRouter();

  axios.defaults.withCredentials = true;

  //Connection
  const onLogin = async (data) => {
    try {
      
      const response = await axios.post('http://localhost:5000/api/auth/login', data); 

      if(response.data.state == "ok"){

        const attributes = getAttributesToken(response.data.result.token);
        const role = attributes.role;
        const idEmploye = attributes.employeId

        toast.success("Connexion...", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {fontWeight: 500, color: "green"}
        });

        // Stocker le token et le rôle
        localStorage.setItem('token', response.data.result.token);
        localStorage.setItem('role', role);
        localStorage.setItem('id', idEmploye)

        // Redirection selon le rôle
        if (role === 'Admin') {
          router.push('/');
        } else if (role === 'Employe') {
          router.push('/accueil'); // Redirection vers la page utilisateur
        }  

      } else {

        if(response.data.message.includes("passe")){
          setErrorMessage({
            type: "password",
            message: response.data.message
          })
        } else {
          setErrorMessage({
            type: "email",
            message: response.data.message
          })
        }

      }
      
    } catch (error) {
      console.log(error)
    }
  };

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const handleKeyDown = (e) => {
    if (formRef.current) {
      if (e.key === 'Enter') {
        formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
  };


  return (
    <div className='w-full'>
      <ToastContainer/>
      <div className="w-full">

        <div className="w-full">
          <div className="flex flex-col justify-center items-center mb-2">
            <h2 className='text-xl font-bold text-bleuspat mb-2'>LOGIN</h2>
            <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
          </div>
          <form ref={formRef} onKeyDown={handleKeyDown} onSubmit={handleSubmit(onLogin)} className='flex items-center flex-col w-full flex-wrap gap-4'>

            <div className='flex flex-col w-full items-center'>
              <Input
                isRequired
                label="Email"
                variant="bordered"
                className="max-w-md font-semibold login"
                {...register('email', { 
                  required: 'Email requis', 
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Entrer un email valide'
                  }
                })}
                endContent={
                  <div className='flex h-full items-center'>
                    <Image src='/maillog.png' alt='mail-icon' width={20} height={20} className='pointer-events-none'/>
                  </div>
                }
                onChange={()=>setErrorMessage({})}
                isInvalid={!!errors.email}
                errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.email ? errors.email.message : ''}</span>} 
              />  
              {errorMessage.type == "email" && <span className="flex justify-start text-[#f31260] text-xs text-right">{errorMessage.message}</span>} 
            </div>
              
            <div className='flex flex-col w-full items-center'>
              <Input
                isRequired
                type='password'
                label="Mot de passe"
                variant="bordered"
                className="max-w-md font-semibold login group"
                {...register('password', { 
                  required: 'Mot de passe requis', 
                })}
                endContent={
                  <div className='flex h-full items-center group-focus-within:hidden'>
                    <Image src='/password.png' alt='password-icon' width={20} height={20} className='pointer-events-none'/>
                  </div>
                }
                onChange={()=>setErrorMessage({})}
                isInvalid={!!errors.password}
                errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.password ? errors.password.message : ''}</span>}
              />
              {errorMessage.type == "password" && <span className="flex justify-start text-[#f31260] text-xs text-right">{errorMessage.message}</span>} 
            </div>

          </form>
          <div className="flex flex-col w-full px-24">
            <div className='flex my-4 mr-1 justify-end'>
              <a href="#" className='text-xs text-gray-500 hover:text-bleuspat/80 font-medium'>Mot de passe oublié ?</a>
            </div>
            <button type="submit" onClick={handleButtonClick} className='w-fit transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-default-50 hover:text-bleuspat'>Se connecter</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login