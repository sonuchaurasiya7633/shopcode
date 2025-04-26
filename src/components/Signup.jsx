import { useState } from "react"
import { Link,useNavigate} from "react-router-dom"
import firebaseAppConfig from "../util/firebase-config"
import { getAuth , createUserWithEmailAndPassword,updateProfile} from "firebase/auth"
import { getFirestore,addDoc,collection, serverTimestamp } from "firebase/firestore"

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)
const Signup = () => {
  const navigate = useNavigate()
  const [error,setError] = useState(null)
  const [loader,setLoader] = useState(false)
  const [formValue, setFormValue] = useState({
    fullname: '',
    email: '',
    mobile:'',
    password: '',
  })

  const signup = async(e) => {
    try{
      e.preventDefault()
      setLoader(true)
    const userCre =    await createUserWithEmailAndPassword(auth,formValue.email,formValue.password,)
      await updateProfile(auth.currentUser,{displayName:formValue.fullname})
      await addDoc(collection(db,"customers"),{
        email:formValue.email,
        customerName:formValue.fullname,
        userId:userCre.user.uid,
        mobile:formValue.mobile,
        role:'user',
        createAt:serverTimestamp()
      })
      navigate('/')
    }
    catch(err)
    {
    setError(err.message)
    }  
    finally{
      setLoader(false)
    }  
  }

  const handleOnChange = (e) => {
   const input = e.target
   const name = input.name
   const value = input.value
   setFormValue({
    ...formValue,
    [name] : value
   })
   setError(null)
  }

  return (
    <div className='grid md:grid-cols-2 h-screen'>
      {/* Image Section */}
      <img
        src='/images/signup1.jpg'
        className='w-full h-48 md:h-full object-cover'
        alt='Signup'
      />

      {/* Form Section */}
      <div className='flex flex-col justify-center md:p-16 p-6 sm:p-8 lg:p-12'>
       
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4'>
          New User
        </h1>
        <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6'>
          Create an account to start shopping
        </p>
        <form className='mt-4 space-y-4' onSubmit={signup}>
          {/* Fullname Field */}
          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Fullname
            </label>
            <input
              required
              onChange={handleOnChange}
              name='fullname'
              type='text'
              placeholder='Enter your name'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
            />
          </div>

          {/* Email Field */}
          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Email Id
            </label>
            <input
              required
              onChange={handleOnChange}
              name='email'
              type='email'
              placeholder='example@gmail.com'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Mobile:
            </label>
            <input
              required
              onChange={handleOnChange}
              name='mobile'
              type='number'
              placeholder='999999999'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
            />
          </div>

          {/* Password Field */}
          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Password
            </label>
            <input
              required
              onChange={handleOnChange}
              name='password'
              type='password'
              placeholder='********'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
            />
          </div>
          {
          loader ? <h1 className="text-lg text-gray-600 font-semibold">Loading...</h1>
          :
          <button className='py-2 sm:py-3 px-6 sm:px-8 bg-blue-600 text-white font-semibold rounded hover:bg-rose-600 transition duration-300'>
            Signup
          </button>
          }
            
          {/* Signup Button */}
          
        </form>
        <div className='mt-3'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 font-semibold'>
            Sign in
          </Link>
        </div>
            
            {
            error && 
        <div className="mt-2 flex justify-between items-center bg-rose-600 p-3 rounded text-white font-semibold shadow-lg animate-pulse">
            <p>{error}</p>
            <button onClick={()=>setError(null)}>
            <i className="ri-close-circle-line"></i>
            </button>
        </div>
            }
      </div>
    </div>
  )
}

export default Signup