import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    passenger_name: '',
    passenger_surname: '',
    passenger_email: ''
  });

  useEffect(() => {
    fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      const response = await axios.get('/api/flights');
      const foundFlight = response.data.find(f => f._id === flightId);
      if (!foundFlight) {
        setError('Flight not found');
        return;
      }
      setFlight(foundFlight);
    } catch (err) {
      setError('Failed to retrieve flight information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.passenger_name.trim()) {
      setError('Enter first name');
      return;
    }
    if (!formData.passenger_surname.trim()) {
      setError('Enter last name');
      return;
    }
    if (!formData.passenger_email.trim()) {
      setError('Enter email');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/tickets', {
        ...formData,
        flight_id: flightId
      });

      // Success, navigate to confirmation page
      navigate(`/confirmation/${response.data.ticket._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  if (!flight) return <div className="container"><div className="message error">{error}</div></div>;

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
      <h2>Ticket Purchase</h2>

      <div className="card">
        <h3>Flight Information</h3>
        <p><strong>Route:</strong> {flight.from_city.city_name} → {flight.to_city.city_name}</p>
        <p><strong>Departure:</strong> {formatTime(flight.departure_time)}</p>
        <p><strong>Arrival:</strong> {formatTime(flight.arrival_time)}</p>
        <p><strong>Price:</strong> ₺{flight.price}</p>
        <p><strong>Available Seats:</strong> {flight.seats_available}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Passenger Information</h3>

        {error && <div className="message error">{error}</div>}

        <div>
          <label>First Name *</label>
          <input
            type="text"
            name="passenger_name"
            value={formData.passenger_name}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            disabled={submitting}
          />
        </div>

        <div>
          <label>Last Name *</label>
          <input
            type="text"
            name="passenger_surname"
            value={formData.passenger_surname}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            disabled={submitting}
          />
        </div>

        <div>
          <label>Email *</label>
          <input
            type="email"
            name="passenger_email"
            value={formData.passenger_email}
            onChange={handleInputChange}
            placeholder="Email@example.com"
            disabled={submitting}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Processing...' : 'Buy Ticket'}
        </button>
      </form>
    </div>
  );
}

export default BookingPage;
