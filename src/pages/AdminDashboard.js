import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ token }) {
  const [flights, setFlights] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    flight_id: '',
    from_city: '',
    to_city: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    seats_total: ''
  });

  useEffect(() => {
    fetchFlights();
    fetchCities();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('/api/flights');
      setFlights(response.data);
    } catch (err) {
      setError('Failed to retrieve flights');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      flight_id: '',
      from_city: '',
      to_city: '',
      departure_time: '',
      arrival_time: '',
      price: '',
      seats_total: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.flight_id || !formData.from_city || !formData.to_city ||
        !formData.departure_time || !formData.arrival_time || !formData.price || !formData.seats_total) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.from_city === formData.to_city) {
      setError('Departure and arrival cities must be different');
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        // Update
        await axios.put(`/api/flights/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Flight updated');
      } else {
        // Add new flight
        await axios.post('/api/flights', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Flight added');
      }

      resetForm();
      fetchFlights();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flight) => {
    setFormData({
      flight_id: flight.flight_id,
      from_city: flight.from_city.city_id,
      to_city: flight.to_city.city_id,
      departure_time: new Date(flight.departure_time).toISOString().slice(0, 16),
      arrival_time: new Date(flight.arrival_time).toISOString().slice(0, 16),
      price: flight.price,
      seats_total: flight.seats_total
    });
    setEditingId(flight._id);
    setShowForm(true);
  };

  const handleDelete = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await axios.delete(`/api/flights/${flightId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Flight deleted');
        fetchFlights();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete flight');
        console.error(err);
      }
    }
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
      <h2>✈️ Admin Panel - Flight Management</h2>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ marginBottom: '2rem' }}>
          + Add New Flight
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'Edit Flight' : 'Add New Flight'}</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Flight Number (e.g. TK001)*</label>
              <input
                type="text"
                name="flight_id"
                value={formData.flight_id}
                onChange={handleInputChange}
                disabled={editingId || loading}
                placeholder="TK001"
              />
            </div>

            <div>
              <label>Departure City*</label>
              <select name="from_city" value={formData.from_city} onChange={handleInputChange} disabled={loading}>
                <option value="">Select</option>
                {cities.map(city => (
                  <option key={city._id} value={city.city_id}>{city.city_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Arrival City*</label>
              <select name="to_city" value={formData.to_city} onChange={handleInputChange} disabled={loading}>
                <option value="">Select</option>
                {cities.map(city => (
                  <option key={city._id} value={city.city_id}>{city.city_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Departure Time*</label>
              <input
                type="datetime-local"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div>
              <label>Arrival Time*</label>
              <input
                type="datetime-local"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div>
              <label>Price (₺)*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                disabled={loading}
                placeholder="500"
              />
            </div>

            <div>
              <label>Total Seats*</label>
              <input
                type="number"
                name="seats_total"
                value={formData.seats_total}
                onChange={handleInputChange}
                min="1"
                disabled={loading}
                placeholder="180"
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : editingId ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={resetForm} disabled={loading} style={{ backgroundColor: '#6b7280' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <h3>Flights ({flights.length})</h3>

      {flights.length === 0 ? (
        <p>No flights available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Flight No</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight._id}>
                <td>{flight.flight_id}</td>
                <td>{flight.from_city.city_name} → {flight.to_city.city_name}</td>
                <td>{formatTime(flight.departure_time)}</td>
                <td>{formatTime(flight.arrival_time)}</td>
                <td>₺{flight.price}</td>
                <td>{flight.seats_available}/{flight.seats_total}</td>
                <td>
                  <button
                    onClick={() => handleEdit(flight)}
                    style={{ marginRight: '0.5rem', backgroundColor: '#0284c7' }}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(flight._id)}
                    style={{ backgroundColor: '#dc2626' }}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
