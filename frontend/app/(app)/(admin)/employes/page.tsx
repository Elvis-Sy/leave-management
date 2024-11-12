import dynamic from 'next/dynamic'

const EmployePage = dynamic(() => import('@/components/employe').then((mod) => mod.EmployePage), {
  ssr: false 
})

const employe = () => {
  return <EmployePage />
}

export default employe