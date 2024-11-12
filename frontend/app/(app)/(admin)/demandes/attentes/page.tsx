import dynamic from 'next/dynamic'

const Attentes = dynamic(() => import('@/components/demandes/demandeAttente'), {
  ssr: false
})

const attente = () => {
  return (
    <Attentes />
  )
}

export default attente