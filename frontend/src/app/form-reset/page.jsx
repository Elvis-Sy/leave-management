import React from 'react'
import { Input } from '@nextui-org/react'

const FormReset = () => {
  return (
    <div className='flex items-center justify-center text-center w-full h-screen flex-1 px-20'>
      <div className="bg-white rounded-2xl shadow-2xl"> 
        {/* LEFT SIDE */}
        <div className="w-[300px] p-5">
          <div className="py-6">
            <h2 className='text-xl font-bold text-bleuspat mb-2'>Reset Password</h2>
            <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
            <form action="" className='flex flex-col w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>

                <Input
                isRequired
                type="password"
                label="Nouveau mot de passe"
                variant="bordered"
                isInvalid={false}
                errorMessage="Mot de passe invalide..."
                className="max-w-lg font-semibold login group"
                endContent={
                  <div className='flex h-full items-center group-focus-within:hidden'>
                    <img src='/password.png' width={20} height={20} className='pointer-events-none'/>
                  </div>
                }
              />
                
                <Input
                isRequired
                type="password"
                label="Confirmation mot de passe"
                variant="bordered"
                isInvalid={false}
                errorMessage="Mot de passe invalide..."
                className="max-w-lg font-semibold login group"
                endContent={
                  <div className='flex h-full items-center group-focus-within:hidden'>
                    <img src='/password.png' width={20} height={20} className='pointer-events-none'/>
                  </div>
                }
              />

            </form>
            <button type="submit" className='transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-bleuspat'>Confirmer</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FormReset