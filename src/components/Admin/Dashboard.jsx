import Layout from './Layout';
import Chart from 'react-apexcharts';
import React from 'react';

const Dashboard = () => {
  const sales = {
    options: {
      charts: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: [1991, 1983, 1976, 1978, 1988, 1967, 1986, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 60, 70, 91, 125],
      },
    ],
  };

  const profit = {
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          borderRadiusApplication: 'end',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Products Card */}
        <div className="bg-orange-600 rounded-lg text-white shadow-lg p-4 border flex gap-2 items-center">
          <div className="space-y-2">
            <div className="flex justify-center items-center bg-orange-400 w-[54px] h-[54px] border-white border-2 rounded-full shadow-sm">
              <i className="ri-shopping-cart-2-line text-3xl text-white"></i>
            </div>
            <h1 className="font-semibold text-xl">Products</h1>
          </div>
          <div className="border-r-2 border-white h-full"></div>
          <h1 className="text-3xl font-semibold">
            {(6743).toLocaleString()}
          </h1>
        </div>

        {/* Orders Card */}
        <div className="bg-indigo-600 rounded-lg text-white shadow-lg p-4 border flex gap-2 items-center">
          <div className="space-y-2">
            <div className="flex justify-center items-center bg-indigo-400 w-[54px] h-[54px] border-white border-2 rounded-full shadow-sm">
              <i className="ri-shopping-basket-2-line text-3xl text-white"></i>
            </div>
            <h1 className="font-semibold text-xl">Orders</h1>
          </div>
          <div className="border-r-2 border-white h-full"></div>
          <h1 className="text-3xl font-semibold">
            {(67453).toLocaleString()}
          </h1>
        </div>

        {/* Payments Card */}
        <div className="bg-lime-600 rounded-lg text-white shadow-lg p-4 border flex gap-2 items-center">
          <div className="space-y-2">
            <div className="flex justify-center items-center bg-lime-400 w-[54px] h-[54px] border-white border-2 rounded-full shadow-sm">
              <i className="ri-money-dollar-circle-line text-3xl text-white"></i>
            </div>
            <h1 className="font-semibold text-xl">Payments</h1>
          </div>
          <div className="border-r-2 border-white h-full"></div>
          <h1 className="text-3xl font-semibold">
            {(67453).toLocaleString()}
          </h1>
        </div>

        {/* Customers Card */}
        <div className="bg-rose-600 rounded-lg text-white shadow-lg p-4 border flex gap-2 items-center">
          <div className="space-y-2">
            <div className="flex justify-center items-center bg-rose-400 w-[54px] h-[54px] border-white border-2 rounded-full shadow-sm">
              <i className="ri-user-line text-3xl text-white"></i>
            </div>
            <h1 className="font-semibold text-xl">Customers</h1>
          </div>
          <div className="border-r-2 border-white h-full"></div>
          <h1 className="text-3xl font-semibold">
            {(1000).toLocaleString()}
          </h1>
        </div>

        {/* Sales Chart */}
        <div className="bg-white shadow-lg rounded-lg p-8 col-span-1 md:col-span-2">
          <h1 className="text-xl font-semibold">Sales</h1>
          <Chart
            options={sales.options}
            series={sales.series}
            type="line"
            height={180}
          />
        </div>

        {/* Profits Chart */}
        <div className="bg-white shadow-lg rounded-lg p-8 col-span-1 md:col-span-2">
          <h1 className="text-xl font-semibold">Profits</h1>
          <Chart
            options={profit.options}
            series={profit.series}
            type="bar"
            height={180}
          />
        </div>

        {/* Dashboard Report */}
        <div className="p-8 bg-purple-600 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-4 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white rounded-full flex items-center">
            <img
              src="/images/sonu.jpg"
              className="rounded-full w-[150px] md:w-[230px]"
              alt="Dashboard"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Report & Analytics</h1>
            <p className="text-gray-50">
              Track your store's performance at a glance. View total sales, completed orders, active users, and top-performing products. Monitor revenue growth, user engagement trends, and conversion rates to make data-driven decisions. Get real-time insights to optimize your strategy and boost sales effectively.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;