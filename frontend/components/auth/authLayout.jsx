import { Divider } from "@nextui-org/divider";
import Image from "next/image";

export const AuthLayoutWrapper = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {children}
      </div>

      <div className="hidden my-10 md:block">
        <Divider orientation="vertical" />
      </div>

      <div className="hidden md:flex flex-1 relative justify-center p-6">
        <div className="z-10 flex flex-col justify-center gap-6">
          <Image
            src="/port-toamasina-spat.jpg"
            alt="Société du Port à gestion Autonome de Toamasina"
            width={500}
            height={500}
            className="self-center rounded-lg"
          />
          <h1 className="font-bold text-[30px] text-center text-bleuspat">
            Société du Port à gestion Autonome de Toamasina
          </h1>
        </div>
      </div>
    </div>
  );
};