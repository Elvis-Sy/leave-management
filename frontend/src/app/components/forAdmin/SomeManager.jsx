
//Temporaire
const manager = [
    {
        id: 1,
        nom: "Elvis Sylvano",
        poste: "210",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 2,
        nom: "Elvis Sylvano",
        poste: "210",
        description: "andro ts fiasana fa repooos",
    },
    {
        id: 3,
        nom: "Elvis Sylvano",
        poste: "210",
        description: "andro ts fiasana fa repooos",
    },

]

const SomeManager = () => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1">
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Quelques Managers</h1>
                <span className="text-md text-gray-400 font-semibold cursor-default">Voir tout</span>
            </div>
            <div className="grid grid-rows-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
                {manager.map(event=>(
                    <div key={event.id} className="flex justify-between items-center p-2 rouned-md border-2 border-gray-100 border-t-4 border-t-[#829af8]">
                        <div className="flex flex-col items-start">
                            <h1 className="font-semibold text-gray-800">{event.nom}</h1>
                            <span className="text-gray-500 text-sm">{event.description}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <p className="mt-2 text-gray-500 text-xs">Subordones</p>
                            <p className="text-xl font-bold text-[#829af8]">{event.poste}</p>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default SomeManager