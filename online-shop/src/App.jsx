import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import EventSlider from './components/EventNavbar/EventSlider';

function App() {

  return (
<Router>
<Header/>
<EventSlider/>

<Routes>

</Routes>

</Router>
  )
}

export default App
