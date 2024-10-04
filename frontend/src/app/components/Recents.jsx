import {User} from "@nextui-org/react";

//Temporaire
const manager = [
    {
        id: 1,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana",
    },
    {
        id: 2,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana",
    },
    {
        id: 3,
        nom: "Elvis Sylvano",
        poste: "Refusee",
        description: "andro ts fiasana",
    },
    {
        id: 4,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana",
    },
    {
        id: 5,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana",
    },
    {
        id: 6,
        nom: "Elvis Sylvano",
        poste: "Refusee",
        description: "andro ts fiasana",
    },
    {
        id: 7,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana",
    },
    {
        id: 8,
        nom: "Elvis Sylvano",
        poste: "Refusee",
        description: "andro ts fiasana",
    },

]

const Recents = () => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1">
        <div className="w-full">
            <div className="flex items-center justify-start mb-4">
                <h1 className="text-xl font-semibold">Activites recentes des managers</h1>
            </div>
            <div className="flex flex-col gap-2">
                {manager.map(m=>(
                    <div key={m.id} className="flex justify-between items-center p-1 rounded-xl border-2 border-gray-100">
                        <User   
                            name={m.nom}
                            description={m.description}
                            avatarProps={{
                                src: "http://localhost:5000/jenna-ortega-7680x4320-16936.jpg"
                            }}
                        />
                        <div className="flex flex-col text-right mr-1">
                            <p className="mt-2 text-gray-500 text-xs font-medium">Actions</p>
                            <p className={`text-sm font-semibold ${m.poste == "Approuvee" ? "text-[#40c057]" : "text-[#fa5252]"}`}>{m.poste}</p>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Recents