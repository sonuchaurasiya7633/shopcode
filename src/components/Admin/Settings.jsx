import { useEffect, useState } from "react";
import firebaseAppConfig from "../../util/firebase-config";
import { onAuthStateChanged, getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Swal from "sweetalert2";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, onSnapshot  } from "firebase/firestore";

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

const Settings = () => {
  const [orders,setOrders] = useState([])
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/images/avtar.jpeg");
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [formValue, setFormValue] = useState({
    fullname: "",
    email: "",
    mobile: "",
  });

  const [addressId, setAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobile:'',
    userId: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(false);
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    const req = async () => {
      if (session) {
        setFormValue({
          ...formValue,
          fullname: session.displayName || "",
          mobile: session.phoneNumber || "",
          email: session.email || "",
        });

        setAddressForm((prev) => ({
          ...prev,
          userId: session.uid,
        }));

        if (session.photoURL) {
          setProfilePicture(session.photoURL);
        }

     
        const col = collection(db, "addresses");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const addressDoc = snapshot.docs[0];
          const addressData = addressDoc.data();
          setAddressId(addressDoc.id);
          setAddressForm((prev) => ({
            ...prev,
            ...addressData,
          }));
        }
      }
    };
    req();
  }, [session]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (session) {
        const col = collection(db, "orders");
        const q = query(col, where("userId", "==", session.uid));
  
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const temp = [];
          snapshot.forEach((doc) => {
            temp.push({ id: doc.id, ...doc.data() });
          });
          setOrders(temp);
        });
  
        return () => unsubscribe();
      }
    };
    fetchOrders();
  }, [session]);

  const setProfilePictureHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "shopcode");
    data.append("cloud_name", "dqpbo1uho");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dqpbo1uho/image/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();
      setProfilePicture(uploadedImage.url);

      await updateProfile(auth.currentUser, {
        photoURL: uploadedImage.url,
      });

      setSession({ ...auth.currentUser });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormValue = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const saveProfileInfo = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName: formValue.fullname,
        phoneNumber: formValue.mobile,
      });
      Swal.fire({
        icon: "success",
        title: "Profile Updated Successfully",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Update Profile",
        text: err.message,
      });
    }
  };

  const setAddress = async (e) => {
    try {
      e.preventDefault();
      if (addressId) {
       
        const addressRef = doc(db, "addresses", addressId);
        await updateDoc(addressRef, addressForm);
        Swal.fire({
          icon: "success",
          title: "Address Updated Successfully",
        });
      } else {
       
        const docRef = await addDoc(collection(db, "addresses"), addressForm);
        setAddressId(docRef.id); 
        Swal.fire({
          icon: "success",
          title: "Address Saved Successfully",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.message,
      });
    }
  };

  const handleAddressForm = (e) => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    setAddressForm({
      ...addressForm,
      [name]: value,
    });
  };

    const getStatusColor = (status) =>{
      if(status==="processing")
        return "bg-blue-600"
      else if(status==="pending")
        return "bg-indigo-600"
      else if(status==="dispatched")
        return "bg-rose-600"
      else if(status==="returned")
        return "bg-orange-600"
      else 
      return "bg-cyan-600"
    }

  if (session === null)
    return (
      <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
        <span className="relative flex h-16 w-16">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-16 w-16 rounded-full bg-sky-500"></span>
        </span>
      </div>
    );

    return (
      <Layout>
        <div className="mx-auto my-8 md:my-16 shadow-xl rounded-xl p-4 md:p-10 w-full md:w-8/12 lg:w-6/12 bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
            <i className="ri-shopping-cart-line text-4xl text-sky-600"></i>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Orders</h1>
          </div>
          <hr className="my-6 border-gray-300" />
    
          {orders.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 mb-8">
              <img src={item.image} className="w-full md:w-[100px] rounded" alt="Order Item" />
              <div>
                <h1 className="capitalize font-semibold text-lg md:text-xl">{item.title}</h1>
                <p className="text-gray-600 text-sm md:text-base">{item.description.slice(0, 50)}</p>
                <div className="space-x-2">
                  <label className="font-bold text-base md:text-lg">
                    ₹{item.price - (item.price * item.discount) / 100}
                  </label>
                  <del className="text-sm md:text-base">₹{item.price}</del>
                  <label className="text-sm md:text-base">({item.discount}% Off)</label>
                </div>
                <button
                  className={`mt-2 ${getStatusColor(item.status)} rounded px-3 py-1 text-xs md:text-sm font-medium text-white capitalize`}
                >
                  {item.status}
                </button>
              </div>
            </div>
          ))}
        </div>
    
        <div className="mx-auto my-8 md:my-16 shadow-xl rounded-xl p-4 md:p-10 w-full md:w-8/12 lg:w-6/12 bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
            <i className="ri-user-line text-4xl text-sky-600"></i>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profile</h1>
          </div>
          <hr className="my-6 border-gray-300" />
          <div className="w-24 h-24 md:w-28 md:h-28 mx-auto relative mb-8">
            {loading ? (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                Uploading...
              </div>
            ) : (
              <img
                src={profilePicture}
                className="rounded-full w-full h-full border-4 border-sky-600 shadow-lg object-cover"
                alt="Profile Avatar"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={setProfilePictureHandler}
            />
          </div>
    
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={saveProfileInfo}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Fullname</label>
              <input
                onChange={handleFormValue}
                required
                name="fullname"
                type="text"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={formValue.fullname}
              />
            </div>
    
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                disabled
                name="email"
                type="email"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={formValue.email}
              />
            </div>
    
            <div />
    
            <button className="md:col-span-2 mt-4 px-6 py-3 bg-sky-600 text-white rounded-md font-semibold hover:bg-sky-700 transition-all duration-300">
              <i className="ri-save-line mr-2"></i>
              Save
            </button>
          </form>
        </div>
    
        <div className="mx-auto my-8 md:my-16 shadow-xl rounded-xl p-4 md:p-10 w-full md:w-8/12 lg:w-6/12 bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
            <i className="ri-link-unlink-m text-4xl text-sky-600"></i>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Delivery Address</h1>
          </div>
          <hr className="my-6 border-gray-300" />
    
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={setAddress}>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Area/Street/Vill</label>
              <input
                onChange={handleAddressForm}
                required
                name="address"
                type="text"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={addressForm.address}
              />
            </div>
    
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                onChange={handleAddressForm}
                required
                name="city"
                type="text"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={addressForm.city}
              />
            </div>
    
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">State</label>
              <input
                onChange={handleAddressForm}
                required
                name="state"
                type="text"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={addressForm.state}
              />
            </div>
    
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input
                onChange={handleAddressForm}
                required
                name="country"
                type="text"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={addressForm.country}
              />
            </div>
    
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Pincode</label>
              <input
                onChange={handleAddressForm}
                required
                name="pincode"
                type="number"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={addressForm.pincode}
              />
            </div>
    
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Mobile</label>
              <input
                onChange={handleAddressForm}
                required
                name="mobile"
                type="number"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                value={addressForm.mobile}
              />
            </div>
    
            <div />
    
            <button
              className={`md:col-span-2 mt-4 px-6 py-3 ${
                addressId ? "bg-green-600" : "bg-blue-600"
              } text-white rounded-md font-semibold hover:bg-sky-700 transition-all duration-300`}
            >
              <i className="ri-save-line mr-2"></i>
              {addressId ? "Save" : "Submit"}
            </button>
          </form>
        </div>
      </Layout>
    );
};

export default Settings;
