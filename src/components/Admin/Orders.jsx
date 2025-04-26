import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import firebaseAppConfig from '../../util/firebase-config';
import { getFirestore, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import moment from 'moment';

const db = getFirestore(firebaseAppConfig);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [toggleAddress, setToggleAddress] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(null);

  useEffect(() => {
    const fetchOrders = () => {
      const colRef = collection(db, "orders");

      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const tmp = [];
        snapshot.forEach((doc) => {
          const order = doc.data();
          order.OrderId = doc.id;
          tmp.push(order);
        });
        setOrders(tmp);
      });

      return () => unsubscribe();
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (e, OrderId) => {
    try {
      const status = e.target.value;
      const ref = doc(db, "orders", OrderId);
      await updateDoc(ref, { status: status });
      Swal.fire({
        icon: "success",
        title: "Order status updated",
      });
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <Layout>
      <div>
      
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-rose-600 text-white">
                <th className="py-4 px-2">OrderedId</th>
                <th className="px-2">Customer's Name</th>
                <th className="px-2">Email</th>
                <th className="px-2">Mobile</th>
                <th className="px-2">Product</th>
                <th className="px-2">Amount</th>
                <th className="px-2">Date</th>
                <th className="px-2">Address</th>
                <th className="px-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((item, index) => (
                <tr
                  className="text-center"
                  key={index}
                  style={{
                    background: (index + 1) % 2 === 0 ? '#f1f5f9' : '#fff',
                    transition: '0.3s',
                  }}
                >
                  <td className="py-4 px-2">{item.OrderId}</td>
                  <td className="capitalize px-2">{item.customerName}</td>
                  <td className="px-2">{item.email}</td>
                  <td className="px-2">{item.address?.mobile || "N/A"}</td>
                  <td className="capitalize px-2">{item.title}</td>
                  <td className="px-2"> ₹{Number(item.price).toLocaleString()}</td>
                  <td className="px-2">{moment(item.createdAt.toDate()).format("DD MMM YYYY , hh:mm:ss A")}</td>
                  <td className="px-2">
                    <button
                      className="text-blue-600 font-medium"
                      onClick={() => {
                        setToggleIndex(index);
                        setToggleAddress(!toggleAddress);
                      }}
                    >
                      Browse Address
                    </button>
                    {(toggleAddress && toggleIndex === index) && (
                      <div className="mt-2 text-left">
                        {`${item.address.address}, ${item.address.city}, ${item.address.state}, ${item.address.country}, ${item.address.pincode}, mob-${item.address?.mobile || "N/A"}`}
                      </div>
                    )}
                  </td>
                  <td className="capitalize px-2">
                    <select
                      className="border p-1 border-gray-300 bg-pink-500 text-white"
                      value={item.status || 'pending'}
                      onChange={(e) => updateOrderStatus(e, item.OrderId)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;