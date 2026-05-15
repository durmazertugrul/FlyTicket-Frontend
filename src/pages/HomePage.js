import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [flights, setFlights] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const navigate = useNavigate();

  // Search parameters
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });

  useEffect(() => {
    fetchCities();
    fetchUpcomingFlights();
  }, []);

  const fetchUpcomingFlights = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const [todayRes, tomorrowRes] = await Promise.all([
        axios.get('/api/flights/search', { params: { date: today } }),
        axios.get('/api/flights/search', { params: { date: tomorrow } })
      ]);
      const combined = [...todayRes.data, ...tomorrowRes.data].slice(0, 4);
      setUpcomingFlights(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/cities');
      setCities(response.data);
    } catch (err) {
      console.error('Failed to retrieve cities:', err);
    }
  };

  const fetchFlights = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/flights/search', { params });
      setFlights(response.data);
    } catch (err) {
      setError('Failed to retrieve flights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    fetchFlights(searchParams);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="container">
      <h2>Search Flights</h2>

      <form onSubmit={handleSearch}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem' }}>
          <div>
            <label>Departure City</label>
            <select name="from" value={searchParams.from} onChange={handleInputChange}>
              <option value="">Select</option>
              {cities.map(city => (
                <option key={city._id} value={city.city_id}>{city.city_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Arrival City</label>
            <select name="to" value={searchParams.to} onChange={handleInputChange}>
              <option value="">Select</option>
              {cities.map(city => (
                <option key={city._id} value={city.city_id}>{city.city_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit">Search</button>
          </div>
        </div>
      </form>

      {!searched && upcomingFlights.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Yaklaşan Uçuşlar</h3>
          <div>
            {upcomingFlights.map(flight => (
              <div key={flight._id} className="card flight-card">
                <div className="flight-info">
                  <div>
                    <div className="flight-route">
                      {flight.from_city.city_name} → {flight.to_city.city_name}
                    </div>
                    <div className="flight-time">
                      {formatTime(flight.departure_time)} - {formatTime(flight.arrival_time)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flight-price">₺{flight.price}</div>
                  <div className="flight-seats">{flight.seats_available} koltuk</div>
                </div>
                <div>
                  <button
                    onClick={() => navigate(`/booking/${flight._id}`)}
                    disabled={flight.seats_available <= 0}
                  >
                    {flight.seats_available > 0 ? 'Rezervasyon' : 'Dolu'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="message error">{error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {searched && !loading && (
        <>
          <h3>Flights Found: {flights.length}</h3>
          {flights.length === 0 && <p>No flights found.</p>}
        </>
      )}

      {searched && flights.length > 0 && (
        <div>
          {flights.map(flight => (
            <div key={flight._id} className="card flight-card">
              <div className="flight-info">
                <div>
                  <div className="flight-route">
                    {flight.from_city.city_name} → {flight.to_city.city_name}
                  </div>
                  <div className="flight-time">
                    {formatTime(flight.departure_time)} - {formatTime(flight.arrival_time)}
                  </div>
                </div>
              </div>

              <div>
                <div className="flight-price">₺{flight.price}</div>
                <div className="flight-seats">
                  {flight.seats_available} seats
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate(`/booking/${flight._id}`)}
                  disabled={flight.seats_available <= 0}
                >
                  {flight.seats_available > 0 ? 'Book' : 'Full'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
