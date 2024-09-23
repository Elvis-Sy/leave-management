import Link from "next/link";
import Menu from '../components/Menu'
import Topbar from '../components/Topbar'

export default function DashboardLayout({ children }) {
    return (
      <div className="h-screen flex">

        {/* LEFT SIDE */}
        <div className="w-[16%] md:w-[10%] lg:w-[16%] xl:w-[14%] transition-all duration-500 bg-white">

            {/* Lien vers home */}
            <Link href="/" className="flex justify-center lg:justify-center">
                {/* Logo du site */}
                <img src="/logo.svg" alt="logo" className="z-20" width={63} height={63}/>
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