import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Calendar, CreditCard } from 'lucide-react';
import api from '../api';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>My Reservations</h1>

      {loading ? (
        <p>Loading your reservations...</p>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Bookings Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>You haven't made any reservations yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem' }}>{booking.hotelName}</h3>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '99px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: booking.status === 'CONFIRMED' ? 'var(--success)' : 'inherit'
                  }}>
                    {booking.status}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Room {booking.roomNumber} • Ref: {booking.reservationNumber}
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Check-in</span>
                    <strong>{booking.checkInDate}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Check-out</span>
                    <strong>{booking.checkOutDate}</strong>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                  ${booking.totalPrice}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <CreditCard size={14} /> Paid securely
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
