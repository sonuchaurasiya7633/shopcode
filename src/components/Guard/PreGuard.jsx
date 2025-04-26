import { useEffect,useState } from 'react'
import firebaseAppConfig from '../../util/firebase-config'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { Navigate,Outlet } from 'react-router-dom'
const auth = getAuth(firebaseAppConfig)

const PreGuard = () => {
  const [session,setSession] = useState(null)
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setSession(user)
      }else{
        setSession(false)
      }
    })
  },[])

  if (session === null)
    return (
      <div className='bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center'>
        <span className='relative flex h-16 w-16'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
          <span className='relative inline-flex h-16 w-16 rounded-full bg-sky-500'></span>
        </span>
      </div>
    );
   if(session)
    return <Navigate to='/' />
   return <Outlet/>
}

export default PreGuard
