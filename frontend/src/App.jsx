import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
