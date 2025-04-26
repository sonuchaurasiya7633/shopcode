import {useState,useEffect} from 'react'
import React from 'react'
import Layout from './Layout' 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation,Pagination } from 'swiper/modules';
import firebaseAppConfig from '../util/firebase-config';
import { onAuthStateChanged,getAuth } from 'firebase/auth';
import { getFirestore,addDoc,collection,getDocs,serverTimestamp,query,where,  } from 'firebase/firestore';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Orders from './Admin/Orders';

const db  = getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)
const Home = ({slider,title="🆕 Latest All Products"}) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  
   const [session,setSession] = useState(null)
   const [address,setAddress] = useState(null)
   const [updateUi,setUpdateUi] =  useState(false)
   
   useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
  }, []);
   
    useEffect(()=>{
      const req = async() =>{
      const snapshot =await getDocs(collection(db,"products"))
      const temp = []
      snapshot.forEach((doc)=>{
        const allProducts = doc.data()
        allProducts.id = doc.id
        temp.push(allProducts)
      })
      setProducts(temp)
      }
      req()
    },[])

  useEffect(()=>{
    const req =async () => {
     if(session)
     {
    const col = collection(db,"addresses")
    const q = query(col,where("userId", "==" , session.uid))
   const snapshpt = await getDocs(q)
   snapshpt.forEach((doc)=>{
   const document = doc.data()
     setAddress(document)
   })
     }
    }
    req()
  },[session])
console.log(address)
  const addToCart = async(item) =>{
   try{

    item.userId = session.uid
   await addDoc(collection(db,"carts"),item)
   setUpdateUi(!updateUi)
   new Swal({
    icon:'success',
    title:"Product Added to Cart"

   })
   }
   catch(err)
{
  new Swal({
    icon:'error',
    title:'failed',
    text:err.message
  })
}

  }
  const buyNow = async (product) => {
    try {
      product.userId = session.uid
      product.status= "pending"
      const amount = product.price-(product.price*product.discount)/100
     
      const { data } = await axios.post('http://localhost:8080/order', { amount:amount*100}); 
  
      
      const options = {
        key: 'rzp_test_FuC8UMog0hrP8t',
        amount: data.amount,
        order_id: data.orderId,
        name: "You & Me Shop",
        description: product.title,
        image: 'https://i.pinimg.com/736x/ce/56/99/ce5699233cbc0f142250b520d967dff7.jpg',
        handler: async function (response) {
          product.email = session.email;
          product.customerName = session.displayName;
          product.createdAt = serverTimestamp();
          product.address = address; 
          await addDoc(collection(db, "orders"), product);
          navigate('/profile');
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: `Payment ID: ${response.razorpay_payment_id}`,
          });
        },
        notes:{
         name: session.displayName
        },
        prefill: {
          name: "Customer Name", 
          email: "customer@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        navigate('/failed')
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: response.error.description,
        });
      });
    } catch (err) {
      console.error("Error in buyNow:", err.response ? err.response.data : err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
      });
    }
  };
 
  return (
    <Layout update={updateUi}>
   <div>

    { 
    slider &&
    <header>
    <Swiper 
  
    pagination={true}
     navigation={true}
     modules={[Navigation,Pagination]}
   slidesPerView={1}
  
 >
   <SwiperSlide>
     <img
      src='/images/p1.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>
   
   <SwiperSlide>
     <img
      src='/images/p2.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>

   <SwiperSlide>
     <img
      src='/images/p3.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>

   <SwiperSlide>
     <img
      src='/images/p5.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>

   <SwiperSlide>
     <img
      src='/images/p6.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>

   <SwiperSlide>
     <img
      src='/images/p7.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>

   <SwiperSlide>
     <img
      src='/images/p8.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>

   <SwiperSlide>
     <img
      src='/images/p9.jpg'
      className='w-full h-[300px] object-cover'
     />
   </SwiperSlide>
   
 </Swiper>
    </header>
    }
      
    <div className='md:p-16 p-8'>
      <h1 className='text-3xl font-bold text-center'>{title}</h1>
      <p className='text-center mt-3 mb-16 text-gray-600 md:w-7/12 mx-auto'>Explore our newest arrivals — fresh styles, trending gadgets, and everyday essentials. Updated regularly to keep you ahead of the trend.

      🛍️ Shop now, stay ahead!

        </p>
       <div className='md:w-10/12 mx-auto grid md:grid-cols-4 gap-12'>
        {
        products.map((item,index)=>(
           <div key={index} className='shadow-lg rounded overflow-hidden border'>
                <img src= {item.image || "/images/pt.jpg"}/>
                <div className='p-4'>
                  <h1 className='text-lg font-semibold capitalize'>{item.title}</h1>
                  <div className='space-x-3'>
                    <label className='font-semibold text-lg'>{item.price-(item.price*item.discount)/100}</label>
                    <del>₹{item.price}</del>
                    <label className='text-gray-600'>({item.discount}%)</label>
                  </div>
                  <button className='bg-green-500 py-2 w-full rounded text-white font-semibold shadow-lg mt-4' onClick={()=>buyNow(item)}>Buy Now</button>

                  <button onClick={()=>addToCart(item)} className='bg-rose-500 py-2 w-full rounded text-white font-semibold shadow-lg mt-2'>
                  <i className="ri-shopping-cart-2-line mr-2"></i>
                    Add To Cart
                </button>
                </div>
           </div>
        ))
      }
       </div>
    </div>
  </div>
    </Layout>
  )
}

export default Home
