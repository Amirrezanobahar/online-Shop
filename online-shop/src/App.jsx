import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import EventSlider from './components/EventNavbar/EventSlider';
import SpecialOffers from './components/specialOffers/SpecialOffers';

function App() {

  return (
<Router>

<Header/>
<EventSlider/>
<SpecialOffers/>

<Routes>

</Routes>

</Router>
  )
}

export default App
