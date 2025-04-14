import React, { useEffect, useState } from 'react';
import {
  Table, Button, Tag, Input, Space, Card, message,
  Modal, Form, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './UserManagement.css';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/user');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error);
      message.error('خطا در دریافت لیست کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'آیا مطمئن هستید؟',
      content: 'این عمل قابل بازگشت نیست',
      okText: 'بله، حذف شود',
      okType: 'danger',
      cancelText: 'انصراف',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`http://localhost:5000/user/${userId}`);
          message.success('کاربر با موفقیت حذف شد');
          fetchUsers();
        } catch (error) {
          console.error('خطا در حذف کاربر:', error);
          message.error('خطا در حذف کاربر');
          setLoading(false);
        }
      },
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      role: user.role,
      active: user.active,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await axios.put(`http://localhost:5000/user/${editingUser._id}`, values);
      message.success('اطلاعات کاربر با موفقیت به‌روزرسانی شد');
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('خطا در به‌روزرسانی کاربر:', error);
      message.error('خطا در به‌روزرسانی کاربر');
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'نام کاربری',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <span><UserOutlined /> {text}</span>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'ایمیل',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      filters: [
        { text: 'مدیر', value: 'ADMIN' },
        { text: 'کاربر', value: 'USER' },
      ],
      onFilter: (value, record) => record.role === value,
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
      filters: [
        { text: 'فعال', value: true },
        { text: 'غیرفعال', value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: 'تاریخ ایجاد',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('fa-IR'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.role === 'SUPER_ADMIN'}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
            disabled={record.role === 'SUPER_ADMIN'}
          />
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Card className="user-management-card">
        <div className="section-header">
          <h2>مدیریت کاربران</h2>
          <Input
            placeholder="جستجو بر اساس نام کاربری یا ایمیل"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `مجموع ${total} کاربر`
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title="ویرایش کاربر"
        open={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText="ذخیره تغییرات"
        cancelText="انصراف"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="نقش کاربر"
            name="role"
            rules={[{ required: true, message: 'لطفا نقش کاربر را انتخاب کنید' }]}
          >
            <Select>
              <Option value="ADMIN">مدیر</Option>
              <Option value="USER">کاربر عادی</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="وضعیت حساب"
            name="active"
            rules={[{ required: true, message: 'لطفا وضعیت حساب را انتخاب کنید' }]}
          >
            <Select>
              <Option value={true}>فعال</Option>
              <Option value={false}>غیرفعال</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;