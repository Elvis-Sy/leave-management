import {Popover, PopoverTrigger, PopoverContent, User} from "@nextui-org/react";

const Topbar = ()=> {
  return (
      <div className="flex mb-2 items-center md:justify-between justify-end p-2 bg-bleuspat">
        {/* Toogle */}
          <img src="/menu.png" alt="" width={32} height={32} className="cursor-pointer hidden md:block"/>

        {/* UTILISATEUR (photo et nom)*/}
        <Popover placement="left">
          <PopoverTrigger className="flex items-center gap-2 bg-[#f1f1f1] py-1 px-2 rounded-xl">
            <div className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] leading-3 font-medium text-gray-900">Elvis Sylvano</span>
                <div className="flex justify-end">
                  <span className="text-xs text-white px-2 rounded-full bg-gray-500">Admin</span>
                </div>
              </div>
              <img src="/avatar.png" alt="" width={30} height={30} className="rounded-full"/>
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
              <div className="border-t text-sm border-gray-300 pt-2 flex items-center justify-end">
                <button className="hover:text-redspat text-redspat/50">Se deconnecter</button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
  )
}

export default Topbar