import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Button } from 'antd';
import { UserOutlined, ShoppingOutlined, BarChartOutlined, ShopOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [newUsers, setNewUsers] = useState([]);

  // Fake data for chart
  const salesData = [
    { name: 'فروردین', sales: 4000 },
    { name: 'اردیبهشت', sales: 3000 },
    { name: 'خرداد', sales: 5000 },
    { name: 'تیر', sales: 4780 },
    { name: 'مرداد', sales: 5890 },
    { name: 'شهریور', sales: 6390 },
  ];

  // Fake data for table
  useEffect(() => {
    setRecentOrders([
      { id: 1, customer: 'علی رضایی', total: '120,000 تومان', status: 'ارسال شد' },
      { id: 2, customer: 'مریم احمدی', total: '350,000 تومان', status: 'در انتظار' },
      { id: 3, customer: 'سارا محمدی', total: '220,000 تومان', status: 'لغو شد' },
    ]);

    setNewUsers([
      { id: 1, name: 'امیر کریمی', email: 'amir@example.com' },
      { id: 2, name: 'زهرا موسوی', email: 'zahra@example.com' },
      { id: 3, name: 'محمد نوری', email: 'mohammad@example.com' },
    ]);
  }, []);

  const orderColumns = [
    { title: 'مشتری', dataIndex: 'customer', key: 'customer' },
    { title: 'مبلغ کل', dataIndex: 'total', key: 'total' },
    { title: 'وضعیت', dataIndex: 'status', key: 'status' },
  ];

  const userColumns = [
    { title: 'نام کاربر', dataIndex: 'name', key: 'name' },
    { title: 'ایمیل', dataIndex: 'email', key: 'email' },
  ];

  return (
    <div className="dashboard-container">
      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="کاربران" value={1245} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="محصولات فعال" value={567} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="سفارشات امروز" value={89} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="درآمد ماهانه" value={24500000} suffix="تومان" prefix={<BarChartOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Sales Chart */}
      <Card title="نمودار فروش ماهانه" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Links */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Button block icon={<ShoppingOutlined />} type="primary" href="/admin/products">
              مدیریت محصولات <ArrowRightOutlined />
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Button block icon={<UserOutlined />} type="primary" href="/admin/users">
              مدیریت کاربران <ArrowRightOutlined />
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Button block icon={<ShoppingOutlined />} type="primary" href="/admin/orders">
              مدیریت سفارشات <ArrowRightOutlined />
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders & New Users */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="سفارشات اخیر">
            <Table dataSource={recentOrders} columns={orderColumns} rowKey="id" pagination={false} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="کاربران جدید">
            <Table dataSource={newUsers} columns={userColumns} rowKey="id" pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
