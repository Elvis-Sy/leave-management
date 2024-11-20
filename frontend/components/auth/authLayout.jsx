import { Divider } from "@nextui-org/divider";
import Image from "next/image";

export const AuthLayoutWrapper = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};