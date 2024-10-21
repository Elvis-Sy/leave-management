
import { Divider } from "@nextui-org/divider";

export const AuthLayoutWrapper = ({ children }) => {
  return (
    <div className='flex h-screen'>
      <div className='flex-1 flex-col flex items-center justify-center p-6'>
        {children}
      </div>

      <div className='hidden my-10 md:block'>
        <Divider orientation='vertical' />
      </div>

      <div className='hidden md:flex flex-1 relative flex justify-center p-6'>

        <div className='z-10 flex flex-col gap-6'>
          <h1 className='font-bold text-[30px] text-center text-bleuspat'>Société du Port à gestion Autonome de Toamasina</h1>
          <img src="/couverture.png" alt="" width={500} height={500}/>
        </div>
      </div>
    </div>
  );
};
