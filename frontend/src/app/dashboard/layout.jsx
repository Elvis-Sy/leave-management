import Link from "next/link";
import Menu from '../components/Menu'
import Topbar from '../components/Topbar'

export default function DashboardLayout({ children }) {
    return (
      <div className="h-screen flex">

        {/* LEFT SIDE */}
        <div className="w-[16%] md:w-[10%] lg:w-[16%] xl:w-[14%] p-4 transition-all duration-500 bg-white/60 backdrop-blur-[100px] border border-white/30 shadow-lg">

            {/* Lien vers home */}
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
                {/* Logo du site */}
                <img src="/logo.png" alt="logo" width={32} height={32} className="z-20"/>
                {/* Nom de site */}
                <span className="absolute text-transparent left-16 lg:text-black lg:left-14 font-bold font-mono text-xl transition-all -z-20 lg:z-30">Conges <br /> Management</span>
            </Link>

            {/* Different menus */}
            <Menu/>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-[84%] md:w-[90%] lg:w-[84%] xl:w-[86%] overflow-y-scroll">
            <Topbar/>
            {children}
        </div>

      </div>
    );
  }