import 'remixicon/fonts/remixicon.css';
import 'animate.css';

import {
BrowserRouter,
Routes,
Route
}from 'react-router-dom'
import AdminProducts from './components/Admin/Products.jsx'
import Orders from './components/Admin/Orders.jsx'
import Dashboard from './components/Admin/Dashboard.jsx'
import NotFound from './components/NotFound.jsx'
import Payment from './components/Admin/Payment.jsx';
import Settings from './components/Admin/Settings.jsx'
import Customers from './components/Admin/Customers.jsx'
import Home from './components/Home.jsx'
import Category from './components/Category.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Contact from './components/Contact.jsx'
import PreGuard from './components/Guard/PreGuard.jsx'
import Cart from './components/Cart.jsx'
import Profile from './components/Profile.jsx'
import Failed from './components/Failed.jsx';
import AdminGuard from './components/Guard/AdminGuard.jsx';
const App = () => {
  return (
<BrowserRouter>
    <Routes>
      <Route path='/' element={<Home slider={true}/>}/>
      <Route path='/products' element={<Home slider={false} title="All Products"/>}/>
      <Route path='/category' element={<Category/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route element={<PreGuard/>}>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Route>
      
      <Route path='/contact-us' element={<Contact/>}/>
      <Route element={<AdminGuard/>}>
        <Route path='/admin' >
        <Route path='products' element={<AdminProducts/>}/>
        <Route path='orders' element={<Orders/>}/>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='/admin/payment' element={<Payment/>}/>
        <Route path='settings' element={<Settings/>}/>
        <Route path='customers' element={<Customers/>}/>
        </Route>
      </Route>
      <Route path='/failed' element={<Failed/>}/>
     <Route path='*' element={<NotFound/>}/>
  </Routes>
</BrowserRouter>

  )
}

export default App

