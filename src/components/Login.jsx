import { useState } from 'react'
import firebaseAppConfig from '../util/firebase-config'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { Link,useNavigate } from 'react-router-dom'

const auth = getAuth(firebaseAppConfig)

const Login = () => {
  const navigate = useNavigate()
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [loader,setLoader] = useState(false)
  const login = async (e) => {
    try {
      e.preventDefault()
      setLoader(true)
      await signInWithEmailAndPassword(
        auth,
        formValue.email,
        formValue.password
      )
      navigate('/') 
    } catch (err) {
      console.log(err)
      setError(err.message) 
    }
    finally{
      setLoader(false)
    }
  }

  const handleChange = (e) => {
    const input = e.target
    const name = input.name
    const value = input.value
    setFormValue({
      ...formValue,
      [name]: value,
    })
    setError(null)
  }

  return (
    <div className="grid md:grid-cols-2 h-screen">
      
      <img
        src="/images/signup1.jpg"
        className="w-full h-48 md:h-full object-cover"
        alt="Signup"
      />

   
      <div className="flex flex-col justify-center md:p-16 p-6 sm:p-8 lg:p-12">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Signing
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6">
          Enter Profile details to login
        </p>
        <form className="mt-4 space-y-4" onSubmit={login}>
         
          <div className="flex flex-col">
            <label className="text-sm sm:text-base md:text-lg font-bold mb-1">
              Email Id
            </label>
            <input
              onChange={handleChange}
              required
              name="email"
              type="email"
              placeholder="example@gmail.com"
              className="border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
            />
          </div>

       
          <div className="flex flex-col">
            <label className="text-sm sm:text-base md:text-lg font-bold mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              required
              name="password"
              type="password"
              placeholder="********"
              className="border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base"
            />
          </div>

         
          {error && (
            <div className="text-red-600 text-sm font-semibold mt-2">
              {error}
            </div>
          )}

         {
         loader ? 
         <h1 className='text-lg font-bold text-gray-600'>Loading...</h1>
         :
         <button className="py-2 sm:py-3 px-6 sm:px-8 bg-blue-600 text-white font-semibold rounded hover:bg-rose-600 transition duration-300">
         Login
       </button>
         }
          
        </form>
        <div className="mt-3">
          Don`t have an account ?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login