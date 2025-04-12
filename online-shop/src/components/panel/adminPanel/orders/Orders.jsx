import React from "react";
import { CheckCircle, Clock, Truck, Eye, Trash2 } from "lucide-react";
import './Orders.css'

const orders = [
  {
    id: "ORD-1001",
    customer: "علی رضایی",
    date: "2025-04-10",
    total: "1,200,000 تومان",
    status: "در انتظار بررسی",
  },
  {
    id: "ORD-1002",
    customer: "زهرا موسوی",
    date: "2025-04-11",
    total: "850,000 تومان",
    status: "ارسال شده",
  },
  {
    id: "ORD-1003",
    customer: "محمد احمدی",
    date: "2025-04-12",
    total: "2,500,000 تومان",
    status: "تحویل داده شده",
  },
];

const statusStyles = {
  "در انتظار بررسی": {
    icon: <Clock className="w-4 h-4 mr-1" />,
    className: "bg-yellow-100 text-yellow-800",
  },
  "ارسال شده": {
    icon: <Truck className="w-4 h-4 mr-1" />,
    className: "bg-blue-100 text-blue-800",
  },
  "تحویل داده شده": {
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
    className: "bg-green-100 text-green-800",
  },
};

export default function Orders() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">مدیریت سفارشات</h2>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-right text-gray-600">
              <th className="py-4 px-6">کد سفارش</th>
              <th className="py-4 px-6">مشتری</th>
              <th className="py-4 px-6">تاریخ</th>
              <th className="py-4 px-6">مبلغ کل</th>
              <th className="py-4 px-6">وضعیت</th>
              <th className="py-4 px-6">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 font-medium">{order.id}</td>
                <td className="py-4 px-6">{order.customer}</td>
                <td className="py-4 px-6">{order.date}</td>
                <td className="py-4 px-6 font-semibold text-gray-900">
                  {order.total}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order.status].className}`}
                  >
                    {statusStyles[order.status].icon}
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 space-x-2 space-x-reverse flex">
                  <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition text-xs shadow-md">
                    <Eye className="w-4 h-4 ml-1" />
                    مشاهده
                  </button>
                  <button className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition text-xs shadow-md">
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
