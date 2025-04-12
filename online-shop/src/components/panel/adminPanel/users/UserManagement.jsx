import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import './UserManagement.css'; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user');
        setUsers(response.data || []);
      } catch (error) {
        console.error('خطا در دریافت کاربران:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    // TODO: پیاده‌سازی حذف کاربر
    console.log('حذف کاربر با آیدی:', userId);
  };

  const handleEdit = (userId) => {
    // TODO: پیاده‌سازی ویرایش کاربر
    console.log('ویرایش کاربر با آیدی:', userId);
  };

  const columns = [
    {
      title: 'نام کاربر',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <span><UserOutlined /> {text}</span>,
    },
    {
      title: 'ایمیل',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'نقش',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'volcano' : 'geekblue'}>
          {role === 'ADMIN' ? 'مدیر' : 'کاربر'}
        </Tag>
      ),
    },
    {
      title: 'وضعیت',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'فعال' : 'غیرفعال'}
        </Tag>
      ),
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record._id)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card className="user-management-card">
      <div className="section-header">
        <h2>مدیریت کاربران</h2>
        <Input
          placeholder="جستجو بر اساس نام یا ایمیل"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default UserManagement;
