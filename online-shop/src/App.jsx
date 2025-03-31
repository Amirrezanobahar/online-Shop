import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import EventSlider from './components/EventNavbar/EventSlider';
import SpecialOffers from './components/specialOffers/SpecialOffers';
import Products from './components/products/Products';

function App() {

  return (
<Router>

<Header/>
<EventSlider/>
<SpecialOffers/>
<Products/>

<Routes>

</Routes>

</Router>
  )
}

export default App
