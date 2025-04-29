
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebaseAppConfig from '../util/firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection,query,where,getDocs,getFirestore } from 'firebase/firestore';

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig)

const Layout = ({ children ,update}) => {
  const [open, setOpen] = useState(false)
  const [accountMenu, setAccountMenu] = useState(false)
  const [session, setSession] = useState(null)
  const [cartCount,setCartCount] = useState(0)
  const[role,setRole] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(false);
      }
    });
  }, []);

  useEffect(()=>{
    if(session)
    {
      const req = async() =>{
      const col = collection(db,"carts")
      const q = query(col,where("userId", "==" , session.uid))
    const snapshot =  await getDocs(q)
    setCartCount(snapshot.size)
      }
      req()
    }
   
  },[session,update]) 

  useEffect(()=>{
    if(session)
    {
      const req = async() =>{
      const col = collection(db,"customers")
      const q = query(col,where("userId", "==" , session.uid))
    const snapshot =  await getDocs(q)
      snapshot.forEach((doc)=>{
        const customer = doc.data()
        setRole(customer.role)
      })
      }
      req()
    }
   
  },[session]) 


  const menus = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/category' },
    { label: 'Contact us', href: '/contact-us' },
   
  ];

  const mobileLink = (href) => {
    setOpen(false);
    navigate(href);
  };

  if (session === null)
    return (
      <div className='bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center'>
        <span className='relative flex h-16 w-16'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
          <span className='relative inline-flex h-16 w-16 rounded-full bg-sky-500'></span>
        </span>
      </div>
    );

  return (
    <div>
      <nav className='sticky top-0 left-0 shadow-lg bg-slate-100 z-50'>
        <div className='w-10/12 mx-auto flex justify-between items-center '>
          <img src='/images/logo1.png' className='w-[100px] shadow-xl' />

          <button className='md:hidden' onClick={() => setOpen(!open)}>
            <i className='ri-menu-2-line text-3xl'></i>
          </button>

          <ul className='md:flex gap-6 items-center hidden'>
            {menus.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className='block py-8 text-center text-gray-600 hover:text-white font-semibold text-lg hover:bg-blue-600 w-[100px]'
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {
           ( session && cartCount>0) && 
            <Link to='/cart' className='relative flex flex-col items-center group'>
          
            <div className="relative">
              <i className="ri-shopping-cart-2-line text-3xl text-gray-800 group-hover:text-rose-600 transition" />
              
              
              <span className='absolute -top-3.5 -right-0 bg-rose-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow'>
              {cartCount}
              </span>
            </div>
          
           
            <span className='text-sm text-gray-600 mt-1 group-hover:text-rose-600 transition'>Cart</span>
          </Link>
          
          
            }

            {
            
            !session && 
            
            (
              <>
                <Link
                  to='/login'
                  className='block py-8 text-center text-gray-600 hover:text-white font-semibold text-lg hover:bg-blue-600 w-[100px]'
                >
                  Login
                </Link>

                <Link
                  to='/signup'
                  className='block bg-blue-600 py-2 px-10 text-center hover:text-white font-semibold text-lg hover:bg-rose-600 text-white'
                >
                  Signup
                </Link>
              </>
            )}

            {
            session && (
              <button className='relative' onClick={() => setAccountMenu(!accountMenu)}>
               <img
                 src={session && session.photoURL ? session.photoURL : '/images/avtar.jpeg'}
                 className="w-10 h-10 rounded-full ring-4 ring-blue-500 transition duration-300 hover:scale-105"
                 />


                {accountMenu && (
                  <div className='flex flex-col  items-start w-[150px] py-2  bg-white absolute top-12 right-0 animate-pulse shadow-xl shadow-gray-400'>
                      
                      {
                      (role && role === "admin") && 
                      
                    <Link to='/admin/dashboard'  className='w-full px-3 py-2 text-left hover:bg-gray-100 text-sm md:text-base'>
                    <i className="ri-file-shield-line mr-2"></i>
                       Admin Panel
                    </Link>
                      }
                    
                    <Link to='/profile' className='w-full px-3 py-2 text-left hover:bg-gray-100'>
                    <i className="ri-user-line mr-2"></i>
                       My Profile
                    </Link>
                    <Link to='/cart' className='w-full text-left px-3 py-2 hover:bg-gray-100'>
                    <i className="ri-shopping-cart-2-line mr-2"></i>
                       Cart
                    </Link>
                    <button 
                    className='w-full text-left px-3 py-2 hover:bg-gray-100' onClick={()=>signOut(auth)}
                    >
                    <i className="ri-logout-circle-line mr-2"></i>
                      Log out
                      </button>
                  </div>
                )}
              </button>
            )}
          </ul>
        </div>
      </nav>

      {/* Spacer to offset sticky navbar */}
      <div className='h-[80px] md:h-[5px]'></div>

      <div>{children}</div>

      <footer className='bg-neutral-800 py-16 relative'>
        <div className='w-10/12 mx-auto grid md:grid-cols-4 md:gap-0 gap-8'>
          <div>
            <h1 className='text-white text-2xl font-semibold mb-3'>Website Link</h1>
            <ul className='space-y-2'>
              {menus.map((item, index) => (
                <li key={index} className='text-gray-100 mb-3'>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link to='/login' className='text-gray-100 mb-3'>
                  Login
                </Link>
              </li>
              <li>
                <Link to='/signup' className='text-gray-100 mb-3'>
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h1 className='text-white text-2xl font-semibold mb-3'>Follow us</h1>
            <ul className='space-y-2'>
              <li>
                <Link to='/' className='text-gray-100 mb-3'>
                  Facebook
                </Link>
              </li>
              <li>
                <Link to='/' className='text-gray-100 mb-3'>
                  Instagram
                </Link>
              </li>
              <li>
                <Link to='/' className='text-gray-100 mb-3'>
                  Twitter
                </Link>
              </li>
              <li>
                <Link to='/' className='text-gray-100 mb-3'>
                  Youtube
                </Link>
              </li>
              <li>
                <Link to='/' className='text-gray-100 mb-3'>
                  Linkedin
                </Link>
              </li>
              <li>
                <Link to='/' className='text-gray-100 mb-3'>
                  Pinterest
                </Link>
              </li>
            </ul>
          </div>

          <div className='pr-8'>
            <h1 className='text-white text-2xl font-semibold mb-3'>Brand Details</h1>
            <p className='text-gray-100 mb-6'>
              ShopeCode is your go-to e-commerce platform for quality products, fast delivery, and a smooth shopping experience — all in one place.
            </p>
            <img src='/images/logo1.png' className='w-[80px] rounded shadow-lg bg-white' />
          </div>

          <div>
            <h1 className='text-white text-2xl font-semibold mb-3'>Contact Us</h1>
            <form className='space-y-4'>
              <input required name='fullname' className='bg-white w-full rounded p-3' placeholder='Your Name' type='text' />
              <input required name='email' className='bg-white w-full rounded p-3' placeholder='Enter Email Id' type='email' />
              <textarea required name='message' className='bg-white w-full rounded p-3' placeholder='Message' rows={3} />
              <button className='bg-black text-white py-3 rounded-md font-semibold px-6'>Submit</button>
              
            </form>
            
          </div>
        </div>
        <h1 className=" absolute bottom-0 w-full text-center text-white text-xs md:text-sm py-4 bg-neutral-800">
         &copy; {new Date().getFullYear()} ShopeCode 🛒 — All rights reserved. <br />
        Made with ❤️ | Powered by Innovation 🚀 | Stay Connected 🌐
      </h1>
      </footer>

      <aside
  className='overflow-hidden md:hidden bg-slate-900 shadow-lg fixed top-0 left-0 h-full z-50'
  style={{
    width: open ? 250 : 0,
    transition: 'width 0.3s ease-in-out',
  }}
>
  <div className='flex flex-col p-8 gap-6'>
    {session && (
      <div>
        <button className='relative' onClick={() => setAccountMenu(!accountMenu)}>
          <div className='flex items-center gap-3'>
            <img
              src={session.photoURL ? session.photoURL : '/images/avtar.jpeg'}
              className='w-10 h-10 rounded-full hover:border hover:border-blue-500'
              alt='User Avatar'
            />
            <div>
              <p className='text-white capitalize text-left'>{session.displayName}</p>
              <p className='text-white'>{session.email}</p>
            </div>
          </div>

          {accountMenu && (
            <div className='flex flex-col items-start w-[150px] py-2 bg-white absolute top-12 right-0 animate-pulse shadow-xl shadow-gray-400'>

              {/* Admin Panel - Only in Mobile and Logged in */}
              <Link
                to='/admin'
                className='w-full px-3 py-2 text-left hover:bg-gray-100 block md:hidden'
              >
                <i className='ri-dashboard-line mr-2'></i>
                Admin Panel
              </Link>

              <Link to='/profile' className='w-full px-3 py-2 text-left hover:bg-gray-100'>
                <i className='ri-user-line mr-2'></i>
                My Profile
              </Link>
              <Link to='/cart' className='w-full text-left px-3 py-2 hover:bg-gray-100'>
                <i className='ri-shopping-cart-2-line mr-2'></i>
                Cart
              </Link>
              <button
                className='w-full text-left px-3 py-2 hover:bg-gray-100'
                onClick={() => signOut(auth)}
              >
                <i className='ri-logout-circle-line mr-2'></i>
                Log out
              </button>
            </div>
          )}
        </button>
      </div>
    )}

    <ul className='space-y-2'>
      {menus.map((item, index) => (
        <li key={index} className='text-gray-100 mb-3'>
          <button onClick={() => mobileLink(item.href)} className='text-left'>
            {item.label}
          </button>
        </li>
      ))}

      {/* Login / Signup - Only Mobile and Not Logged In */}
      {!session && (
        <>
          <li className='block md:hidden'>
            <button onClick={() => mobileLink('/login')} className='text-left text-gray-100 mb-3'>
              Login
            </button>
          </li>
          <li className='block md:hidden'>
            <button onClick={() => mobileLink('/signup')} className='text-left text-gray-100 mb-3'>
              Signup
            </button>
          </li>
        </>
      )}
    </ul>
  </div>
</aside>


    </div>
  );
};

export default Layout;
