export const colManager =[
   {
     name: "Info",
     uid: "info"
   },
   {
     name: "Matricule",
     uid: "matricule", 
     className:"hidden md:table-cell"
   },
   {
     name: "Effectifs",
     uid: "nbrSub", 
     className:"hidden md:table-cell"
   },
   {
     name: "Poste",
     uid: "poste", 
     className:"hidden md:table-cell"
   },
   {
     name: "Action",
     uid: "actions"
   },
 ]

export const colEmploye =[
   {
     name: "Info",
     uid: "info"
   },
  //  {
  //    name: "Matricule",
  //    uid: "matricule", 
  //    className:"hidden md:table-cell"
  //  },
   {
     name: "Date Embauche",
     uid: "DateEmb", 
     className:"hidden md:table-cell"
   },
   {
     name: "Poste",
     uid: "poste", 
     className:"hidden lg:table-cell"
   },
   {
     name: "Manager",
     uid: "manager", 
     className:"hidden lg:table-cell"
   },
   {
     name: "Actions",
     uid: "actions"
   },
 ]

 export const colEmployeManage =[
  {
    name: "Info",
    uid: "info"
  },
  // {
  //   name: "Matricule",
  //   uid: "matricule", 
  //   className:"hidden md:table-cell"
  // },
  {
    name: "Date Embauche",
    uid: "DateEmb", 
    className:"hidden md:table-cell"
  },
  {
    name: "Poste",
    uid: "poste", 
    className:"hidden lg:table-cell"
  },
  {
    name: "Actions",
    uid: "actions"
  },
]

export const colValide =[
  {
    name: "Info demande",
    uid: "infoD"
  },
  {
    name: "Info demandeur",
    uid: "infoDemande", 
    className: "hidden xl:table-cell"
  },
  {
    name: "Date d'envoi",
    uid: "dateEnvoi", 
    className: "hidden lg:table-cell"
  },
  {
    name: "Date confirmation",
    uid: "dateConfirmation", 
    className: "hidden lg:table-cell"
  },
  {
    name: "Responsable",
    uid: "respConfirmation", 
    className: "hidden xl:table-cell"
  },
  {
    name: "Statut",
    uid: "statut", 
  },
]

export const colAttente =[
  {
    name: "Info demande",
    uid: "infoD"
  },
  {
    name: "Date d'envoi",
    uid: "dateEnvoi", 
    className: "hidden lg:table-cell"
  },
  {
    name: "Info demandeur",
    uid: "infoDemande", 
    className: "hidden md:table-cell"
  },
  {
    name: "Date debut - fin",
    uid: "Duree", 
    className:"hidden md:table-cell"
  },
  {
    name: "Actions",
    uid: "actions"
  },
]

export const colDemandes =[
  {
    name: "Type",
    uid: "infoD"
  },
  {
    name: "Date d'envoi",
    uid: "dateEnvoi", 
    className: "hidden lg:table-cell"
  },
  {
    name: "Date confirmation",
    uid: "dateConfirmation", 
    className: "hidden lg:table-cell"
  },
  {
    name: "Date debut - fin",
    uid: "Duree", 
    className:"hidden md:table-cell"
  },
  {
    name: "Durée",
    uid: "nbr", 
    className:"hidden md:table-cell"
  },
  {
    name: "Statut",
    uid: "statut", 
  },
  {
    name: "Actions",
    uid: "actions"
  },
]

export const colCollegue = [
  {
    name: "Photo",
    uid: "photo",
    className:"hidden lg:table-cell"
  },
  {
    name: "Nom",
    uid: "nom", 
  },
  {
    name: "Poste",
    uid: "poste", 
  },
]

export const colType = [
  {
    name: "Label",
    uid: "label"
  },
  {
    name: "Total jours",
    uid: "total"
  },
  {
    name: "Actions",
    uid: "actions"
  }
]

export const colHistory =[
  {
    name: "Responsable",
    uid: "responsable"
  },
  {
    name: "Niveau",
    uid: "niveau", 
    className: "hidden lg:table-cell"
  },
  {
    name: "Date",
    uid: "date", 
    className: "hidden xl:table-cell"
  },
  {
    name: "Ancien statut",
    uid: "ancien", 
    className: "hidden xl:table-cell"
  },
  {
    name: "Nouveau statut",
    uid: "nouveau", 
    className: "hidden xl:table-cell"
  },
  {
    name: "Action",
    uid: "statut", 
  },
]
