import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './components/footer/footer';
import Register from './components/register/Register';
import Body from './components/body/Body';
import Header from './components/header/Header'


function App() {

  return (
<Router>
<Header/>


<Routes>
  <Route path="/" element={<Body/>} />
<Route path="/register" element={<Register/>} />

</Routes>

<Footer/>
</Router>


  )
}

export default App
