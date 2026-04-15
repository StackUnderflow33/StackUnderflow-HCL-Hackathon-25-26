import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import api from '../api';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advanced Search State
  const [params, setParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    minPrice: '',
    maxPrice: ''
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const AMENITIES_LIST = ['Free Wi-Fi', 'Swimming Pool', 'Spa', 'Gym'];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (isSearch = false) => {
    setLoading(true);
    try {
      let queryParams = {};
      if (isSearch) {
        if (params.location) queryParams.location = params.location;
        if (params.checkIn) queryParams.checkIn = params.checkIn;
        if (params.checkOut) queryParams.checkOut = params.checkOut;
        if (params.minPrice) queryParams.minPrice = params.minPrice;
        if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
        if (selectedAmenities.length > 0) {
          queryParams.amenities = selectedAmenities.join(',');
        }
      }

      const response = await api.get('/hotels/advanced-search', { params: queryParams });
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels(true);
  };

  const toggleAmenity = (name) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(prev => prev.filter(a => a !== name));
    } else {
      setSelectedAmenities(prev => [...prev, name]);
    }
  };

  return (
    <div>
      <section className="hero">
        <h1>Discover Your Perfect Stay</h1>
        <p>Book the finest hotels, resorts, and vacation rentals at the best prices.</p>

        <div className="glass-panel" style={{ marginTop: '2rem', maxWidth: '900px', margin: '2rem auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="input-group" style={{ flex: 2, minWidth: '250px' }}>
                <label className="input-label" style={{ color: '#fff' }}>Destination</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '35px', background: 'rgba(255,255,255,0.1)' }}
                    placeholder="Where to?"
                    value={params.location}
                    onChange={(e) => setParams({ ...params, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className="input-label" style={{ color: '#fff' }}>Check In</label>
                <input
                  type="date"
                  className="input-field"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  value={params.checkIn}
                  onChange={(e) => setParams({ ...params, checkIn: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className="input-label" style={{ color: '#fff' }}>Check Out</label>
                <input
                  type="date"
                  className="input-field"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  value={params.checkOut}
                  onChange={(e) => setParams({ ...params, checkOut: e.target.value })}
                  min={params.checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>

              <div className="input-group" style={{ width: '120px' }}>
                <label className="input-label" style={{ color: '#fff' }}>Min Price ($)</label>
                <input type="number" className="input-field" placeholder="0" style={{ background: 'rgba(255,255,255,0.1)' }} value={params.minPrice} onChange={(e) => setParams({ ...params, minPrice: e.target.value })} />
              </div>

              <div className="input-group" style={{ width: '120px' }}>
                <label className="input-label" style={{ color: '#fff' }}>Max Price ($)</label>
                <input type="number" className="input-field" placeholder="1000+" style={{ background: 'rgba(255,255,255,0.1)' }} value={params.maxPrice} onChange={(e) => setParams({ ...params, maxPrice: e.target.value })} />
              </div>

              <div style={{ flex: 1, display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Filter size={14} /> Amenities:
                </span>
                {AMENITIES_LIST.map(amenity => (
                  <label key={amenity} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>

              <button type="submit" className="btn-primary" style={{ minWidth: '150px' }}>Find Hotels</button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Destination Results</h2>
        {loading ? (
          <p>Loading superior results dynamically...</p>
        ) : (
          <div className="hotels-grid">
            {hotels.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <MapPin size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3>No Accommodations Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters, dates, or removing required amenities.</p>
              </div>
            ) : (
              hotels.map(hotel => (
                <div className="hotel-card" key={hotel.id}>
                  <img src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} alt={hotel.name} className="hotel-image" />
                  <div className="hotel-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 className="hotel-title">{hotel.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 'bold' }}>
                        <Star fill="#fbbf24" size={16} />
                        {hotel.rating}
                      </div>
                    </div>
                    <div className="hotel-location">
                      <MapPin size={16} />
                      {hotel.city}, {hotel.country}
                    </div>

                    <div className="amenity-tags">
                      {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="tag">{amenity}</span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="tag">+{hotel.amenities.length - 3} more</span>
                      )}
                    </div>

                    <Link to={`/hotel/${hotel.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
                      View Real-Time Availability
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
