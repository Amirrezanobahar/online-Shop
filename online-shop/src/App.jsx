import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './components/footer/footer';
import Register from './components/auth/register/Register';
import Login from './components/auth/login/Login'
import Body from './components/body/Body';
import Header from './components/header/Header'
import ProductDetail from './components/body/productDetail/ProductDetail';
import ProtectedRoute from './components/auth/panel/ProtectedRoute';
import AdminPanel from './components/panel/AdminPanel';



function App() {

  return (
    <Router>
      <Header />


      <Routes>
        
        <Route path="/" element={<Body />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<ProductDetail/>} />
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


  )
}

export default App
