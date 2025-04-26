import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import firebaseAppConfig from '../../util/firebase-config';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import moment from 'moment';

const db = getFirestore(firebaseAppConfig);

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const req = async () => {
      const snapshot = await getDocs(collection(db, "customers"));
      const tmp = [];
      snapshot.forEach((doc) => {
        const document = doc.data();
        tmp.push(document);
      });
      setCustomers(tmp);
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
                <th className="p-4">Customer's Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item, index) => (
                <tr
                  className="text-center"
                  key={index}
                  style={{
                    background: (index + 1) % 2 === 0 ? '#f1f5f9' : '#fff',
                  }}
                >
                  <td className="capitalize px-4 py-3">
                    <div className="flex gap-3 items-center">
                      <img
                        src="/images/avtar.jpeg"
                        className="w-10 h-10 rounded-full"
                        alt="Avatar"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold">{item.customerName}</h1>
                        <small className="text-gray-600">{item.date}</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-2">{item.email}</td>
                  <td className="px-2">{item.mobile}</td>
                  <td className="px-2">
                    {item.createAt?.toDate
                      ? moment(item.createAt.toDate()).format('DD MMM YYYY, hh:mm:ss A')
                      : 'N/A'}
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

export default Customers;