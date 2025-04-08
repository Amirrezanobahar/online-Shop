import React from 'react';
import { Layout, Menu, Breadcrumb, Table, Button, Tag } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  
} from '@ant-design/icons';
import './AdminPanel.css';

const { Header, Content, Footer, Sider } = Layout;

const AdminPanel = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible>
        <div className="admin-logo">پنل مدیریت</div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            داشبورد
          </Menu.Item>
          <Menu.Item key="products" icon={<ShoppingOutlined />}>
            مدیریت محصولات
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            کاربران
          </Menu.Item>
          <Menu.Item key="reports" icon={<BarChartOutlined />}>
            گزارش‌ها
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            تنظیمات
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout className="admin-content-layout">
        <Header className="admin-header">
          <div className="admin-header-title">پنل مدیریت</div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>خانه</Breadcrumb.Item>
            <Breadcrumb.Item>داشبورد</Breadcrumb.Item>
          </Breadcrumb>
          <div className="admin-content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {/* Example: Table for Products */}
            <h3>محصولات</h3>
            <Table
              dataSource={[
                {
                  key: '1',
                  name: 'رژلب مایع',
                  stock: 30,
                  price: 120000,
                  category: 'آرایشی',
                  status: 'فعال',
                },
                {
                  key: '2',
                  name: 'کرم پودر',
                  stock: 50,
                  price: 250000,
                  category: 'آرایشی',
                  status: 'فعال',
                },
              ]}
              columns={[
                {
                  title: 'نام محصول',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'موجودی',
                  dataIndex: 'stock',
                  key: 'stock',
                },
                {
                  title: 'قیمت',
                  dataIndex: 'price',
                  key: 'price',
                  render: (text) => `${text.toLocaleString()} تومان`,
                },
                {
                  title: 'دسته‌بندی',
                  dataIndex: 'category',
                  key: 'category',
                },
                {
                  title: 'وضعیت',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'فعال' ? 'green' : 'red'}>{status}</Tag>
                  ),
                },
                {
                  title: 'عملیات',
                  key: 'action',
                  render: () => (
                    <Button type="primary" danger>
                      حذف
                    </Button>
                  ),
                },
              ]}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>© 2025 پنل مدیریت دیجی‌کالا</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
