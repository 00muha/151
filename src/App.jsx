import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import DiscoverPage from './components/DiscoverPage';

// Temporary placeholder so you can test navigation before teammates push their pages
function TeammatePlaceholder({ title, owner }) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0c0e',
        color: '#f5f6f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        gap: '16px',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <span
        style={{
          backgroundColor: '#1e2418',
          color: '#d2ff38',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 700
        }}
      >
        ROUTE CONNECTED SUCCESSFULLY
      </span>
      <h1 style={{ fontSize: '32px' }}>
        {title} {id ? `(Event ID: #${id})` : ''}
      </h1>
      <p style={{ color: '#8b909a', maxWidth: '420px' }}>
        This route is ready for <strong>{owner}</strong> to drop in their component.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '12px',
          backgroundColor: '#d2ff38',
          color: '#0b0c0e',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '999px',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        ← Back to Discover
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Your Main Discover Page */}
        <Route path="/" element={<DiscoverPage />} />

        {/* Teammate Routes (Replace elements as teammates finish their components) */}
        <Route
          path="/explore"
          element={<TeammatePlaceholder title="Explore & Filter Grid" owner="Member 2 (Explore Lead)" />}
        />
        <Route
          path="/host"
          element={<TeammatePlaceholder title="Host a Party Portal" owner="Member 3 (Host Lead)" />}
        />
        <Route
          path="/events/:id"
          element={<TeammatePlaceholder title="Event Details & Checkout" owner="Member 4 (Checkout Lead)" />}
        />
        <Route
          path="/my-tickets"
          element={<TeammatePlaceholder title="Saved Nights & Digital Tickets" owner="Member 5 (Wallet Lead)" />}
        />
        <Route
          path="/gate-scanner"
          element={<TeammatePlaceholder title="Host Gate Scanner" owner="Member 5 (Scanner Lead)" />}
        />
      </Routes>
    </Router>
  );
}