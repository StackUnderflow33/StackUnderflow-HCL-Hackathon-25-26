import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Droplets, Dumbbell, Coffee, UtensilsCrossed, Bell, Gift, Tag } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Promo and Loyalty State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const hotelRes = await api.get(`/hotels/${id}`);
        setHotel(hotelRes.data);
      } catch (error) {
        console.error("Error fetching hotel details", error);
      }
    };
    fetchHotelData();
  }, [id]);

  // Fetch true availability when dates OR hotel ID changes
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let url = `/hotels/${id}/rooms/available`;
        if (checkIn && checkOut) {
           url += `?checkIn=${checkIn}&checkOut=${checkOut}`;
        }
        const roomsRes = await api.get(url);
        setRooms(roomsRes.data);
      } catch (error) {
        console.error("Error fetching available rooms", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, [id, checkIn, checkOut]);

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoCodeInput.trim()) {
      setPromoError('Please enter a code');
      return;
    }
    try {
      const response = await api.get(`/promotions/validate?code=${promoCodeInput.trim()}`);
      setPromoApplied(response.data);
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Invalid Promo Code');
      setPromoApplied(null);
    }
  };

  const pricing = useMemo(() => {
    if (!selectedRoom || !checkIn || !checkOut) return null;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return null;

    let base = selectedRoom.pricePerNight * days;
    let discount = 0;
    
    if (promoApplied) {
       discount = base * (promoApplied.discountPercentage / 100);
    }
    
    let preliminaryTotal = base - discount;
    if (preliminaryTotal < 0) preliminaryTotal = 0;

    let loyaltyPointsUsed = 0;
    if (useLoyaltyPoints && user && user.loyaltyPoints > 0) {
        if (user.loyaltyPoints >= preliminaryTotal) {
            loyaltyPointsUsed = preliminaryTotal;
            discount += preliminaryTotal;
            preliminaryTotal = 0;
        } else {
            loyaltyPointsUsed = user.loyaltyPoints;
            discount += user.loyaltyPoints;
            preliminaryTotal -= user.loyaltyPoints;
        }
    }
    
    const pointsEarned = Math.floor(preliminaryTotal / 100) * 10;

    return {
       base, discount, total: preliminaryTotal, days, ptsEarned: pointsEarned, ptsUsed: loyaltyPointsUsed
    };
  }, [selectedRoom, checkIn, checkOut, promoApplied, useLoyaltyPoints, user]);


  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedRoom || !checkIn || !checkOut) return;

    setBookingLoading(true);
    setBookingResult(null);

    try {
      const payload = {
        roomId: selectedRoom.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        promoCode: promoApplied ? promoApplied.code : null,
        useLoyaltyPoints: useLoyaltyPoints
      };
      
      const response = await api.post('/bookings', payload);
      setBookingResult({ success: true, data: response.data });
      // Clear selections on success
      setSelectedRoom(null);
    } catch (error) {
      setBookingResult({ 
        success: false, 
        message: error.response?.data?.message || 'Failed to process booking.' 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const getIcon = (name) => {
    switch(name) {
      case 'Free Wi-Fi': return <Wifi size={18} />;
      case 'Swimming Pool': return <Droplets size={18} />;
      case 'Gym': return <Dumbbell size={18} />;
      case 'Spa': return <Coffee size={18} />;
      case 'Restaurant': return <UtensilsCrossed size={18} />;
      case 'Room Service': return <Bell size={18} />;
      default: return <Star size={18} />;
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading details...</div>;
  if (!hotel) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Hotel not found.</div>;

  return (
    <div>
      <div style={{ 
        height: '400px', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        marginBottom: '2rem',
        position: 'relative' 
      }}>
        <img 
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
          alt={hotel.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem'
        }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{hotel.name}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#cbd5e1' }}>
              <MapPin size={20} color="var(--secondary-color)" /> {hotel.address}, {hotel.city}, {hotel.country}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#fbbf24', fontWeight: 'bold' }}>
              <Star fill="#fbbf24" size={20} /> {hotel.rating} / 5.0
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>About</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.1rem' }}>{hotel.description}</p>
            
            <h3 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '1rem' }}>Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                  {getIcon(amenity)}
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Available Rooms {checkIn && checkOut && ` for ${checkIn} to ${checkOut}`}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rooms.length === 0 ? <p>No available rooms currently. Please adjust your dates.</p> : rooms.map(room => (
              <div 
                key={room.id} 
                className={`glass-panel ${selectedRoom?.id === room.id ? 'selected-room' : ''}`}
                style={{ 
                  display: 'flex', gap: '1.5rem', padding: '1.5rem', cursor: 'pointer',
                  borderColor: selectedRoom?.id === room.id ? 'var(--primary-color)' : 'var(--border-color)',
                  boxShadow: selectedRoom?.id === room.id ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none'
                }}
                onClick={() => setSelectedRoom(room)}
              >
                <img 
                  src={room.imageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'} 
                  alt={room.roomCategory} 
                  style={{ width: '150px', height: '120px', borderRadius: '12px', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{room.roomCategory} Detail</h3>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      ${room.pricePerNight}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/night</span>
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{room.roomCategoryDescription}</p>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>Room No: {room.roomNumber}</span>
                    <span>•</span>
                    <span>Capacity: {room.capacity} Guests</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
           <div className="glass-panel" style={{ position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Reserve Your Stay</h2>
              
              {bookingResult && (
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  backgroundColor: bookingResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: bookingResult.success ? '#6ee7b7' : '#fca5a5',
                  border: `1px solid ${bookingResult.success ? 'var(--success)' : 'var(--danger)'}`
                }}>
                  {bookingResult.success ? (
                    <>
                      <strong>Booking Confirmed!</strong><br/>
                      Ref: {bookingResult.data.reservationNumber}<br/>
                      <span style={{fontSize: '0.8rem'}}>Confirmation email simulated to backend logs!</span>
                    </>
                  ) : bookingResult.message}
                </div>
              )}

              <form onSubmit={handleBooking}>
                <div className="input-group">
                  <label className="input-label">Check-in Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Check-out Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                {user && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                           <input type="text" className="input-field" placeholder="Promo Code" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} style={{ flex: 1 }} />
                           <button type="button" className="btn-primary" onClick={handleApplyPromo} style={{ padding: '0.5rem 1rem' }}><Tag size={16}/></button>
                        </div>
                        {promoError && <p style={{color: '#fca5a5', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '0.5rem'}}>{promoError}</p>}
                        {promoApplied && <p style={{color: '#6ee7b7', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '0.5rem'}}>Promo {promoApplied.code} Applied! (-{promoApplied.discountPercentage}%)</p>}

                        <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                           <input type="checkbox" id="loyalty" checked={useLoyaltyPoints} onChange={() => setUseLoyaltyPoints(!useLoyaltyPoints)} disabled={user?.loyaltyPoints <= 0} style={{ width: '18px', height: '18px' }} />
                           <label htmlFor="loyalty" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: user?.loyaltyPoints > 0 ? '#fff' : '#64748b' }}>
                              <Gift size={16}/> Use Loyalty Points (Balance: {user.loyaltyPoints})
                           </label>
                        </div>
                    </div>
                )}

                <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                  {pricing ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        <span>Room Rate ({pricing.days} nights):</span>
                        <span>${pricing.base.toFixed(2)}</span>
                      </div>
                      
                      {pricing.discount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#6ee7b7' }}>
                            <span>Total Discount:</span>
                            <span>-${pricing.discount.toFixed(2)}</span>
                          </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${pricing.total.toFixed(2)}</span>
                      </div>
                      
                      {pricing.ptsEarned > 0 && (
                          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.5rem' }}>
                             + {pricing.ptsEarned} Points upon booking!
                          </div>
                      )}
                    </>
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>Select room & dates to see pricing.</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem' }}
                  disabled={!selectedRoom || bookingLoading || bookingResult?.success}
                >
                  {bookingLoading ? 'Processing...' : (bookingResult?.success ? 'Booked' : 'Book Now')}
                </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
