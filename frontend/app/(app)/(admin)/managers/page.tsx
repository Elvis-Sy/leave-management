import dynamic from 'next/dynamic'

const Accounts = dynamic(() => import('@/components/accounts').then((mod) => mod.Accounts), {
  ssr: false
})

const accounts = () => {
  return <Accounts />;
};

export default accounts;
