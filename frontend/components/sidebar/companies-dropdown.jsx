import React from "react";
import Image from "next/image";

export const CompaniesDropdown = () => {
  return (
    <div className="flex items-center gap-2">
      <Image src='/logo.svg' alt="logo" width={70} height={70}/>
      <h3 className="text-xl font-medium m-0 text-default-900 whitespace-nowrap">
        Gestion <br /> de congés
      </h3>
    </div>
  );
};
