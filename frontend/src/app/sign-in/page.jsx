"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@nextui-org/react'
import {getAttributesToken} from '../../components/attributeToken'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {

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
          position: "top-right",
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
          router.push('/dashboard/admin'); // Redirection vers la page admin
        } else if (role === 'Employe') {
          router.push('/dashboard/manager'); // Redirection vers la page utilisateur
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
    <div className='flex flex-col items-center justify-center text-center w-full h-screen flex-1 px-20'>
      <ToastContainer/>
      <div className="bg-white rounded-2xl shadow-2xl flex w-1/2 max-w-5xl">
        {/* LEFT SIDE */}
        <div className="w-full md:w-3/5 p-5">
          <div className="py-6">
            <h2 className='text-xl font-bold text-bleuspat mb-2'>LOG IN</h2>
            <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
            <form ref={formRef} onKeyDown={handleKeyDown} onSubmit={handleSubmit(onLogin)} className='flex flex-col w-full flex-wrap md:flex-nowrap gap-4'>

              <div>
                <Input
                  isRequired
                  label="Email"
                  variant="bordered"
                  className="max-w-xs font-semibold login"
                  {...register('email', { 
                    required: 'Email requis', 
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Entrer un email valide'
                    }
                  })}
                  endContent={
                    <div className='flex h-full items-center'>
                      <img src='/maillog.png' width={20} height={20} className='pointer-events-none'/>
                    </div>
                  }
                  onChange={()=>setErrorMessage({})}
                  isInvalid={!!errors.email}
                  errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.email ? errors.email.message : ''}</span>} 
                />  
                {errorMessage.type == "email" && <span className="flex justify-start text-[#f31260] text-xs text-right">{errorMessage.message}</span>} 
              </div>
                
              <div>
                <Input
                  isRequired
                  type='password'
                  label="Mot de passe"
                  variant="bordered"
                  className="max-w-xs font-semibold login group"
                  {...register('password', { 
                    required: 'Mot de passe requis', 
                  })}
                  endContent={
                    <div className='flex h-full items-center group-focus-within:hidden'>
                      <img src='/password.png' width={20} height={20} className='pointer-events-none'/>
                    </div>
                  }
                  onChange={()=>setErrorMessage({})}
                  isInvalid={!!errors.password}
                  errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.password ? errors.password.message : ''}</span>}
                />
                {errorMessage.type == "password" && <span className="flex justify-start text-[#f31260] text-xs text-right">{errorMessage.message}</span>} 
              </div>

            </form>
            <div className='flex my-4 mr-1 justify-end'>
              <a href="#" className='text-xs text-gray-500 hover:text-bleuspat/80 font-medium'>Mot de passe oublié ?</a>
            </div>
            <button type="submit" onClick={handleButtonClick} className='transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-bleuspat'>Se connecter</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex flex-col items-center w-2/5 bg-bleuspat text-white rounded-r-2xl">
          <div className="bg-gray-100 rounded-full w-fit mt-20">
            <img src="/logo.svg" alt="" width={100} height={100}/>
          </div>
          <div className='w-full px-8'>
            <div className='border-2 w-10 border-white inline-block mb-2 rounded-full'></div>
            <h2 className='text-2xl font-bold mb-2'>Gestion et suivi des congés</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage