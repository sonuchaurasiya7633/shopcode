import React from 'react'
import Layout from './Layout'
const Contact = () => {
  return (
    <Layout>
      <div>
        <header className='md:w-6/12 mx-auto md:my-16 md:shadow-lg bg-white'>
        <img src='/images/contact.jpg' className='w-full'/>
        <div className='p-8'>
        <form className=' space-y-4'>
          {/* Email Field */}
          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Your Name
            </label>
            <input
              required
              name='fullname'
              type='text'
              placeholder='Sonu kumar'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Email Id
            </label>
            <input
              required
              name='email'
              type='email'
              placeholder='example@gmail.com'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-sm sm:text-base md:text-lg font-bold mb-1'>
              Message
            </label>
            <textarea
              required
              name='message'
              placeholder='Enter Your Message here'
              className='border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base'
              rows={4}
            />
          </div>
          {/* Signup Button */}
          <button className='py-2 sm:py-3 px-6 sm:px-8 bg-blue-600 text-white font-semibold rounded hover:bg-rose-600 transition duration-300'>
           Get Quote
          </button>
        </form>
        </div>
        </header>
      </div>
    </Layout>
  )
}

export default Contact
