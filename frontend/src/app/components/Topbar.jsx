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
        <div className="flex flex-col gap-1">
          <span className="text-sm leading-3 font-medium text-gray-900">Elvis Sylvano</span>
          <div className="flex justify-end">
            <span className="text-[12px] text-white px-2 rounded-full bg-gray-500">Admin</span>
          </div>
        </div>
        <img src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
      </div>

    </div>
  )
}

export default Topbar