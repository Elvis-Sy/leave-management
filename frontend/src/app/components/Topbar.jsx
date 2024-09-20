import {Popover, PopoverTrigger, PopoverContent, User} from "@nextui-org/react";

const Topbar = ()=> {
  return (
    <div className="flex items-center md:justify-between justify-end p-4">

      {/* Recherche */}
      <div className='hidden md:flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-400 px-2'>
        <img src="/search.png" alt="" width={14} height={14}/>
        <input type="search" name="tblsearch" placeholder='Recherche...' className='w-[200px] p-2 bg-transparent outline-none placeholder:text-xs'/>
      </div>

      {/* UTILISATEUR (photo et nom)*/}
      <div className="flex items-center gap-4">
        
      </div>

      <Popover showArrow placement="bottom">
        <PopoverTrigger className="flex items-center gap-4">
          <div className="cursor-pointer">
            <div className="flex flex-col gap-1">
              <span className="text-sm leading-3 font-medium text-gray-900">Elvis Sylvano</span>
              <div className="flex justify-end">
                <span className="text-[12px] text-white px-2 rounded-full bg-gray-500">Admin</span>
              </div>
            </div>
            <img src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-1">
          <div className="flex flex-col gap-4 p-2">
            <div className="flex items-center justify-between w-[250px]">
              <User   
                name="Elvis Sylvano"
                description="elvissy@gmail.com"
                avatarProps={{
                  src: "/avatar.png"
                }}
              />
              <span className="text-[12px] text-white px-2 rounded-full bg-gray-500">Admin</span>
            </div>
            <div>
              <p className="text-sm text-gray-700">Responsable de l'hygiene</p>
              <p className="text-sm text-gray-700">Dernière connexion : <span className="font-semibold">15 septembre 2024</span></p>
            </div>
            <div className="border-t text-sm border-gray-300 pt-2 flex items-center justify-between">
              <button className="text-[#829af8] hover:text-blue-500">Paramètres du profil</button>
              <button className="text-[#e66165] hover:text-red-500">Se deconnecter</button>
            </div>
          </div>


          {/* <div className="flex flex-col gap-2 p-2">
          <div className="font-semibold">Nom de l'Admin</div>
          <div className="text-sm text-gray-600">email@exemple.com</div>
          <div className="text-xs text-gray-400">Dernière connexion : 15 septembre 2024</div>
          <div className="border-t border-gray-300 mt-2 pt-2 flex gap-2">
            <a href="/profile" className="text-blue-600 hover:underline">Paramètres du profil</a>
            <a href="/manage-users" className="text-blue-600 hover:underline">Gérer les utilisateurs</a>
          </div>
          <button className="mt-2 text-red-600 hover:underline">Se déconnecter</button>
        </div> */}
        </PopoverContent>
      </Popover>

    </div>
  )
}

export default Topbar