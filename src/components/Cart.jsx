import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import firebaseAppConfig from "../util/firebase-config";
import {
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";
import axios from "axios";

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null);
  const [updateUi, setUpdateUi] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
  }, []);

  useEffect(() => {
    const req = async () => {
      if (session) {
        try {
          // Fetch products from the "carts" collection
          const cartCol = collection(db, "carts");
          const cartQuery = query(cartCol, where("userId", "==", session.uid));
          const cartSnapshot = await getDocs(cartQuery);
          const tempProducts = [];
          cartSnapshot.forEach((doc) => {
            const document = doc.data();
            document.cartId = doc.id;
            tempProducts.push(document);
          });
          setProducts(tempProducts);
        } catch (err) {
          console.error("Error fetching data:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch data. Please try again later.",
          });
        }
      }
    };
    req();
  }, [session, updateUi]);

  const getPrice = (products) => {
    let sum = 0;
    for (let item of products) {
      let amount = Math.round(item.price - (item.price * item.discount) / 100);
      sum = sum + amount;
    }
    return sum;
  };

  const removeCart = async (id) => {
    try {
      const ref = doc(db, "carts", id);
      await deleteDoc(ref);
      setUpdateUi(!updateUi);
    } catch (err) {
      console.log(err);
    }
  };

  const buyNow = async () => {
    try {
      const amount = getPrice(products);

     
      const addressCol = collection(db, "addresses");
      const addressQuery = query(addressCol, where("userId", "==", session.uid));
      const addressSnapshot = await getDocs(addressQuery);

      let address = null;
      if (!addressSnapshot.empty) {
        const addressDoc = addressSnapshot.docs[0].data(); 
        address = addressDoc;
      }

     
      if (!address) {
        Swal.fire({
          icon: "warning",
          title: "Address Required",
          text: "No address found. Please add an address to your profile.",
        });
        return;
      }

    
      const { data } = await axios.post("http://localhost:8085/order", {
        amount: amount * 100,
      });
      console.log(data);

      const options = {
        key: "rzp_test_FuC8UMog0hrP8t",
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        name: "You & Me Shop",
        description: "Bulk products",
        image:
          "https://i.pinimg.com/736x/ce/56/99/ce5699233cbc0f142250b520d967dff7.jpg",
        handler: async function (response) {
          for (let item of products) {
            let product = {
              ...item,
              userId: session.uid,
              status: "pending",
              email: session.email,
              customerName: session.displayName,
              createdAt: serverTimestamp(),
              address: address,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            };
            await addDoc(collection(db, "orders"), product);
            await removeCart(item.cartId)
          }
          navigate("/profile");
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: `Payment ID: ${response.razorpay_payment_id}`,
          });
        },
        notes: {
          name: session.displayName,
        },
        prefill: {
          name: session.displayName || "sonu kumar",
          email: session.email || "customer@example.com",
          contact: session.phoneNumber || "7633036074",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        navigate("/failed");
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: response.error.description,
        });
      });
    } catch (err) {
      console.error(
        "Error in buyNow:",
        err.response ? err.response.data : err.message
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Layout update={updateUi}>
      <div className="my-10 mx-auto w-11/12 md:w-8/12 bg-white shadow-lg border rounded-md p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <i className="ri-shopping-cart-fill text-4xl text-orange-500"></i>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Cart
          </h1>
        </div>
        <hr className="my-6" />
        <div className="space-y-8">
          {products.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4">
              <img
                src={item.image}
                className="w-full md:w-[100px] border border-3 border-white shadow-lg"
                alt={item.title}
              />
              <div>
                <h1 className="font-semibold capitalize text-lg">
                  {item.title}
                </h1>
                <div className="flex flex-col gap-4">
                  <div className="space-x-3">
                    <label className="text-lg font-semibold">
                      ₹
                      {item.price -
                        (item.price * item.discount) / 100}
                    </label>
                    <del>₹{item.price}</del>
                    <label className="text-gray-500">
                      {item.discount}% Discount
                    </label>
                  </div>
                  <button
                    className="w-fit bg-rose-500 text-white px-3 py-2 rounded"
                    onClick={() => removeCart(item.cartId)}
                  >
                    <i className="ri-delete-bin-2-line mr-2"></i>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-6 w-full border-t-2 border-orange-500 mx-auto" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl md:text-2xl font-semibold">
            Total: ₹{getPrice(products).toLocaleString()}
          </h1>
           
           {
         (  products.length > 0) &&
           
           <button
           onClick={buyNow}
           className="w-full md:w-auto bg-green-500 text-white px-6 md:px-12 py-3 rounded mt-4 font-semibold"
         >
           <i className="ri-shopping-bag-4-line mr-2"></i>
           Buy Now
         </button>

           }
        </div>
      </div>
    </Layout>
  );
};

export default Cart;