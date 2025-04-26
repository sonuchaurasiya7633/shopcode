import React from 'react'
import {useState,useEffect} from 'react'
import{Link,useLocation} from 'react-router-dom'
import firebaseAppConfig from '../../util/firebase-config';
import { getAuth, onAuthStateChanged,signOut } from "firebase/auth"

const auth = getAuth(firebaseAppConfig )


const Layout = ({children}) => {
  const [size, setSize] = useState(180)
  const[mobileSize, setMobileSize] = useState(0)
  const [accountMenu, setAccountMenu] = useState(false)
  const [session,setSession] = useState(null)
  const location = useLocation()

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
     if(user)
     {
      setSession(user)
     }
     else
     {
      setSession(null)
     }
    })
  },[])

  const menus = [
    {
      label: 'Dashboard',
      icon:<i className="ri-dashboard-2-line mr-3"></i>,
      link:'/admin/dashboard'
    },
    
    {
      label: 'Customers',
      icon:<i className="ri-user-3-line mr-3"></i>,
      link:'/admin/customers',
     
    },
    
    {
      label: 'Products',
      icon:<i className="ri-shopping-cart-line mr-3"></i>,
      link:'/admin/products'
    },
    {
      label: 'Orders',
      icon:<i className="ri-shape-2-line mr-3"></i>,
      link:'/admin/orders'
    },
    
    {
      label: 'Payment',
      icon:<i className="ri-refund-2-line mr-3"></i>,
      link:'/admin/payment'
    },

    {
      label: 'Settings',
      icon:<i className="ri-settings-5-line mr-3"></i>,
      link:'/admin/settings'
    },

  ]
  return (
   <>

   {/* desktop */}
    <div className='md:block hidden'>
     <aside
     className=' bg-indigo-600 fixed top-0 left-0 h-full overflow-hidden '
     style={{
      width: size,
      transition: ' 0.3s '
     }}
     >
     <div className=' flex flex-col'>
    
     {
     menus.map((item,index) =>(
      <Link to={item.link} className='px-4 py-3 text-gray-50 text-xl hover:bg-rose-600 hover:text-white' key={index}
      style={{
        background:(location.pathname == item.link )?'red' : 'transparent'
      }}>
       {item.icon}
        {item.label}
       
      </Link>
     ))
     }
      <button  onClick={()=> signOut(auth)}
      
     className='px-4 py-3 text-gray-50 text-left text-xl hover:bg-rose-600 hover:text-white'
     >
     <i className="ri-logout-circle-line mr-3"></i>
     Logout
     </button>
     </div>
     </aside>
     <section className='bg-gray-200 min-h-screen'
     style={{
      marginLeft: size,
      transition: ' 0.3s '
      }}>
     <nav className='bg-white shadow-md p-4 flex justify-between items-center sticky top-0 left-0'>
       <div className='flex items-center gap-4'>
        <button
         className='bg-gray-50 hover:bg-indigo-600 hover:text-white w-8 h-8'
         onClick={()=> setSize(size === 180 ? 0 : 180)}
         >
           <i className="ri-menu-2-line text-xl"></i>
        </button>
       
        <h1 className='text-md font-semibold'>Shopcode</h1>
       </div>

       <div>
      <button className='relative' >
        <img src='/images/avtar.jpeg'  onClick={()=>{setAccountMenu(!accountMenu)

        }} className='w-10 h-10 rounded-full'/>

        {
        accountMenu && 
        <div className='absolute bg-white shadow-xl w-[200px] p-6  top-18 right-0 '>
        <div>
          <h1 className='text-lg font-semibold '>{(session && session.displayName) ? session.displayName : "Admin"}</h1>
          <p className='text-gray-500'>{session && session.email}</p>
          <div className='h-px bg-gray-600 my-4'/>
          <button onClick={()=> signOut(auth)}>
           <i    className="ri-logout-circle-line mr-2"></i>
            Logout
          </button>
        </div>
      </div>
        }
       
      </button>
       </div>
     </nav>
      <div className='p-6'>
        {children}
      </div>
     </section>
    </div>
   {/* mobile */}
    <div className='md:hidden block'>
     <aside
     className=' bg-indigo-600 fixed top-0 left-0 h-full z-50 overflow-hidden '
     style={{
      width: mobileSize,
      transition: ' 0.3s '
     }}
     >
     <div className=' flex flex-col'>
     <button 
     className='text-left mx-4 mt-4'
     onClick={()=> setMobileSize(mobileSize === 0 ?180  : 0)}
     >
     <i className="ri-menu-2-fill text-white text-xl "></i>
     </button>
     {
     menus.map((item,index) =>(
      <Link to={item.link} className='px-4 py-3 text-gray-50 text-xl hover:bg-rose-600 hover:text-white' key={index}
      style={{
        background:(location.pathname == item.link )?'red' : 'transparent'
      }}>
       {item.icon}
        {item.label}
       
      </Link>
     ))
     }
     <button 
     onClick={()=> signOut(auth)}
     className='px-4 py-3 text-gray-50 text-left text-xl hover:bg-rose-600 hover:text-white'
     >
     <i className="ri-logout-circle-line mr-3"></i>
     Logout
     </button>
     </div>
     </aside>
     <section className='bg-gray-200 h-screen'
     >
     <nav className='bg-white shadow-md p-4 flex justify-between items-center sticky top-0 left-0'>
       <div className='flex items-center gap-4'>
        <button
         className='bg-gray-50 hover:bg-indigo-600 hover:text-white w-8 h-8'
         onClick={()=> setMobileSize(mobileSize === 0 ?180  : 0)}
         >
           <i className="ri-menu-2-line text-xl"></i>
        </button>
       
        <h1 className='text-md font-semibold'>Shopcode</h1>
       </div>

       <div>
      <button className='relative' >
        <img src='/images/avtar.jpeg'  onClick={()=>{setAccountMenu(!accountMenu)

        }} className='w-10 h-10 rounded-full'/>

        {
        accountMenu && 
        <div className='absolute bg-white shadow-xl w-[200px] p-6  top-18 right-0 '>
        <div>
          <h1 className='text-lg font-semibold '>{(session && session.displayName) ? session.displayName : "Admin"}</h1>
          <p className='text-gray-500'>{session && session.email}</p>
          <div className='h-px bg-gray-600 my-4'/>
          <button
          onClick={()=> signOut(auth)}
          >
           <i    className="ri-logout-circle-line mr-2"></i>
            Logout
          </button>
        </div>
      </div>
        }
       
      </button>
       </div>
     </nav>
      <div className='p-6'>
        {children}
      </div>
     </section>
    </div>

   </>
  )
}

export default Layout










