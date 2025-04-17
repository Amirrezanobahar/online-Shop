import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './components/footer/footer';
import Register from './components/auth/register/Register';
import Login from './components/auth/login/Login'
import Body from './components/body/Body';
import Header from './components/header/Header'
import ProductDetail from './components/body/productDetail/ProductDetail';
import ProtectedRoute from './components/auth/panel/ProtectedRoute';
import AdminPanel from './components/panel/adminPanel/mainPage/AdminPanel';
import { AuthProvider } from './components/auth/logout/AuthContext';
import ProductsAdmin from './components/panel/adminPanel/products/ProductsAdmin'
import AdminDashboard from './components/panel/adminPanel/dashbord/AdminDashboard';
import UsersManagement from './components/panel/adminPanel/users/UserManagement';
import Orders from './components/panel/adminPanel/orders/Orders';
import EventsManagement from './components/panel/adminPanel/events/EventsManagement ';
import Cart from './components/cart/Cart';


function App() {

  return (
    <AuthProvider>
    <Router>
      <Header />


      <Routes>
        
        <Route path="/" element={<Body />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/admin/products" element={<ProductsAdmin/>} />
        <Route path="/admin/" element={<AdminDashboard/>} />
        <Route path="/admin/users" element={<UsersManagement/>} />
        <Route path="/admin/orders" element={<Orders/>} />
        <Route path="/admin/events" element={<EventsManagement/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPanel/>
            </ProtectedRoute>
          }
        />
        // todo for user path='/user-profile'

      </Routes>

      <Footer />
    </Router>
    </AuthProvider>


  )
}

export default App
