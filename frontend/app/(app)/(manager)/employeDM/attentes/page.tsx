import dynamic from 'next/dynamic'

const DMAttente = dynamic(() => import('@/components/demandes/dmAttente').then((mod) => mod.DMAttente), {
  ssr: false
})

const attenteDM = () => {
  return <DMAttente />
}

export default attenteDM