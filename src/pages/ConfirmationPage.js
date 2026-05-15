import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ConfirmationPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get('/api/tickets');
      const foundTicket = response.data.find(t => t._id === ticketId);
      if (!foundTicket) {
        setError('Ticket not found');
        return;
      }
      setTicket(foundTicket);
    } catch (err) {
      setError('Failed to retrieve ticket information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  if (error) return <div className="container"><div className="message error">{error}</div></div>;

  if (!ticket) return <div className="container"><div className="message error">Ticket not found</div></div>;

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

  const flight = ticket.flight_id;

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>✅ Ticket Successfully Purchased!</h2>
      </div>

      <div className="card">
        <h3>Ticket Details</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4>Ticket Number</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a' }}>
              {ticket.ticket_id}
            </p>
          </div>

          <div>
            <h4>Booking Date</h4>
            <p>{formatTime(ticket.booking_date)}</p>
          </div>
        </div>

        <h4>Passenger Information</h4>
        <p><strong>Full Name:</strong> {ticket.passenger_name} {ticket.passenger_surname}</p>
        <p><strong>Email:</strong> {ticket.passenger_email}</p>

        <h4 style={{ marginTop: '1.5rem' }}>Flight Information</h4>
        <p><strong>Flight Number:</strong> {flight.flight_id}</p>
        <p><strong>Route:</strong> {flight.from_city.city_name} → {flight.to_city.city_name}</p>
        <p><strong>Departure Time:</strong> {formatTime(flight.departure_time)}</p>
        <p><strong>Arrival Time:</strong> {formatTime(flight.arrival_time)}</p>
        <p><strong>Ticket Price:</strong> ₺{flight.price}</p>

        {ticket.seat_number && (
          <p><strong>Seat Number:</strong> {ticket.seat_number}</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Please save your ticket number. A booking confirmation has been sent to your email address.
        </p>
        <Link to="/">
          <button>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default ConfirmationPage;
