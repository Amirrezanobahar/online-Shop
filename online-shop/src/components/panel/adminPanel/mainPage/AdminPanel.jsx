import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Table, Button, Tag, Card, Row, Col, Statistic } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/logout/AuthContext';
import './AdminPanel.css';

const { Header, Content, Footer, Sider } = Layout;

const AdminPanel = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Redirect non-admin users
  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [userRole, navigate]);

  // Sample data
  const dashboardStats = [
    { title: 'تعداد کاربران', value: 1245, icon: <UserOutlined /> },
    { title: 'محصولات فعال', value: 567, icon: <ShoppingOutlined /> },
    { title: 'سفارشات امروز', value: 89, icon: <BarChartOutlined /> },
    { title: 'درآمد ماهانه', value: 24500000, suffix: 'تومان', icon: <BarChartOutlined /> }
  ];

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <NavLink to="/admin">داشبورد</NavLink>
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: <NavLink to="/admin/products">محصولات</NavLink>
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <NavLink to="/admin/users">کاربران</NavLink>
    },
    {
      key: '/admin/orders',
      icon: <BarChartOutlined />,
      label: <NavLink to="/admin/orders">سفارشات</NavLink>
    },
    {
      key: '/admin/events',
      icon: <BarChartOutlined />,
      label: <NavLink to="/admin/events">رویداد ها</NavLink>
    }
  ];

  if (!userRole || userRole !== 'ADMIN') {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="admin-logo">پنل مدیریت</div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="admin-header">
          <div className="header-content">
            <div className="header-actions">
              <Button type="primary" onClick={logout}>
                خروج از سیستم
              </Button>
            </div>
          </div>
        </Header>

        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>پنل مدیریت</Breadcrumb.Item>
            <Breadcrumb.Item>
              {menuItems.find(item => item.key === location.pathname)?.label}
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="admin-content">
            {/* Nested Routes */}
            <Outlet />

            {/* Dashboard Content */}
            {location.pathname === '/admin' && (
              <Row gutter={[16, 16]}>
                {dashboardStats.map((stat, index) => (
                  <Col span={6} key={index}>
                    <Card>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        prefix={stat.icon}
                        suffix={stat.suffix}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          سیستم مدیریت فروشگاه ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

// Example Sub-components
export const ProductsManagement = () => {
  const [products, setProducts] = useState([]);

  const columns = [
    { title: 'نام محصول', dataIndex: 'name', key: 'name' },
    { title: 'قیمت', dataIndex: 'price', key: 'price' },
    { title: 'موجودی', dataIndex: 'stock', key: 'stock' },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button icon={<EditOutlined />} type="link" />
          <Button icon={<DeleteOutlined />} type="link" danger />
        </div>
      )
    }
  ];

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>مدیریت محصولات</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          افزودن محصول
        </Button>
      </div>
      <Table 
        dataSource={products} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AdminPanel;