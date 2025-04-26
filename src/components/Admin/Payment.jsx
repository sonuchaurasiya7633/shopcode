import { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import moment from 'moment';

const Payment = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const req = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/payment");
        setPayments(data.items);
      } catch (err) {
        console.log(err);
      }
    };
    req();
  }, []);

  return (
    <Layout>
      <div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-rose-600 text-white">
                <th className="p-4">PaymentId</th>
                <th>Customer's Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, index) => (
                <tr
                  className="text-center"
                  key={index}
                  style={{
                    background: (index + 1) % 2 === 0 ? '#f1f5f9' : '#fff',
                  }}
                >
                  <td className="py-4 px-2">{item.id}</td>
                  <td className="capitalize px-2">
                    {item.notes.name ? item.notes.name : "Sonu kumar"}
                  </td>
                  <td className="px-2">{item.email}</td>
                  <td className="px-2">{item.contact}</td>
                  <td className="px-2">{item.description}</td>
                  <td className="px-2">₹{item.amount.toLocaleString()}</td>
                  <td className="px-2">
                    {moment.unix(item.created_at).format('DD MMM YYYY, hh:mm:ss A')}
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

export default Payment;