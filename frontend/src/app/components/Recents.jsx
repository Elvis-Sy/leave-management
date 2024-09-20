import {User} from "@nextui-org/react";

//Temporaire
const manager = [
    {
        id: 1,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 2,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 3,
        nom: "Elvis Sylvano",
        poste: "Refusee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 4,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 5,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 6,
        nom: "Elvis Sylvano",
        poste: "Refusee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 7,
        nom: "Elvis Sylvano",
        poste: "Approuvee",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 8,
        nom: "Elvis Sylvano",
        poste: "Refusee",
        description: "andro ts fiasana fa repooos",
    },

]

const Recents = () => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1">
        <div className="w-full">
            <div className="flex items-center justify-start mb-4">
                <h1 className="text-xl font-semibold">Activites recentes</h1>
            </div>
            <div className="flex flex-col gap-2">
                {manager.map(m=>(
                    <div key={m.id} className="flex justify-between items-center p-1 rounded-xl border-2 border-gray-100">
                        <User   
                            name={m.nom}
                            description={m.description}
                            avatarProps={{
                                src: "/illustration1.png"
                            }}
                        />
                        <div className="flex flex-col text-right mr-1">
                            <p className="mt-2 text-gray-500 text-xs">Actions</p>
                            <p className={`text-sm font-semibold ${m.poste == "Approuvee" ? "text-[#4ade80]" : "text-[#e66165]"}`}>{m.poste}</p>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Recents