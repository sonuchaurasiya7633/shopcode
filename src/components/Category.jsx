import { useState } from 'react'
import Layout from './Layout'

const Category = () => {
  const [Category, setCategory] = useState([
    { title: 'Electronics' },
    { title: 'Fashion' },
    { title: 'Kitchen' },
    { title: 'Personal Care' },
    { title: 'Sports' },
    { title: 'Games' },
    { title: 'Books' },
    { title: 'Toys' },
  ])

  return (
    <Layout>
      <div className='px-4 py-6'>
        <div className='w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          {Category.map((item, index) => (
            <div
              key={index}
              className='hover:bg-orange-600 hover:text-white bg-white rounded-xl shadow-md flex justify-center items-center p-4 sm:p-5 md:p-6 lg:p-8 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] transition duration-300 ease-in-out cursor-pointer'
            >
              <div className='flex flex-col items-center text-center'>
                <i className='ri-menu-search-line text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2'></i>
                <h1 className='text-sm sm:text-base md:text-lg lg:text-xl font-semibold'>{item.title}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Category
