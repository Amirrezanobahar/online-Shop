import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import EventSlider from './components/EventNavbar/EventSlider';
import SpecialOffers from './components/specialOffers/SpecialOffers';
import Products from './components/products/Products';
import Footer from './components/footer/footer';


function App() {

  return (
<Router>

<Header/>
<EventSlider/>
<SpecialOffers/>
<Products/>

<Routes>

</Routes>

<Footer/>
</Router>


  )
}

export default App
