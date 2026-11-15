import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Discover.css';

const INITIAL_EVENTS = [
  {
    id: '1',
    pickLabel: "TONIGHT'S PICK",
    title: 'Above the city.',
    subtitle: 'A rooftop, a sunset, and your new favorite DJ.',
    venue: 'The Williamsburg Rooftop',
    distance: '1.2 mi',
    distanceMiles: 1.2,
    time: 'Tonight, 8 PM – late',
    price: 20,
    tags: ['House', 'Rooftop'],
    neighborhood: 'WILLIAMSBURG',
    spotsLeft: 8,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    pickLabel: 'UNDERGROUND PICK',
    title: 'Basement frequencies',
    subtitle: ' Raw industrial warehouse sound system all night.',
    venue: 'Bushwick Vault',
    distance: '2.4 mi',
    distanceMiles: 2.4,
    time: '11 PM – 4 AM',
    price: 15,
    tags: ['Techno', 'Warehouse'],
    neighborhood: 'BUSHWICK',
    spotsLeft: 5,
    image: 'https://images.unsplash.com/photo-1571266028243-cb40fce756fd?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    pickLabel: 'CROWD FAVORITE',
    title: 'Disco, not dead.',
    subtitle: 'Vinyl-only grooves, mirrorballs, and zero pretension.',
    venue: 'Greenpoint Loft',
    distance: '0.8 mi',
    distanceMiles: 0.8,
    time: '9 PM – 2 AM',
    price: 0,
    tags: ['Disco', 'House'],
    neighborhood: 'GREENPOINT',
    spotsLeft: 14,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    pickLabel: 'SECRET PIN',
    title: 'Velvet Afterhours',
    subtitle: 'Late-night amapiano & afro-house session.',
    venue: 'SoHo Secret Loft',
    distance: '3.1 mi',
    distanceMiles: 3.1,
    time: '10 PM – late',
    price: 25,
    tags: ['Afrobeats', 'Rooftop'],
    neighborhood: 'SOHO',
    spotsLeft: 3,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80'
  }
];

export default function DiscoverPage() {
  const navigate = useNavigate();

  // State for events, filters, and saved lineup
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]); // Tracks swiped cards for Undo button
  const [savedParties, setSavedParties] = useState([
    { id: '99', price: 20 },
    { id: '98', price: 15 },
    { id: '97', price: 0 },
    { id: '96', price: 25 }
  ]);

  // Filter states
  const [activeVibe, setActiveVibe] = useState('All vibes');
  const [freeOnly, setFreeOnly] = useState(false);
  const [within5Mi, setWithin5Mi] = useState(true);

  // Animation & Drag Physics states
  const [animClass, setAnimClass] = useState(''); // 'swipe-left', 'swipe-right', 'rewind-in', 'surprise-pulse'
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Surprise Me Modal states
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [surpriseEvent, setSurpriseEvent] = useState(null);
  const [surpriseCriteria, setSurpriseCriteria] = useState('best'); // 'best', 'budget', 'closest'
  // Fetch from json-server if running, otherwise fallback to INITIAL_EVENTS
  useEffect(() => {
    fetch('http://localhost:3000/events')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch(() => {
        // Keeps INITIAL_EVENTS if json-server isn't started yet
      });
  }, []);

  // Filtered deck
  const filteredEvents = events.filter((ev) => {
    const matchesVibe =
      activeVibe === 'All vibes' || ev.tags.some((t) => t.toLowerCase() === activeVibe.toLowerCase());
    const matchesPrice = !freeOnly || ev.price === 0;
    const matchesDistance = !within5Mi || ev.distanceMiles <= 5;
    return matchesVibe && matchesPrice && matchesDistance;
  });

  const currentCard = filteredEvents[currentIndex];
  const nextCard = filteredEvents[currentIndex + 1];
  const totalSavedDamage = savedParties.reduce((sum, item) => sum + (item.price || 0), 0);

  // --- SWIPE ACTIONS ---
  const triggerSwipe = (direction) => {
    if (!currentCard || animClass) return;

    setAnimClass(direction === 'right' ? 'swipe-right' : 'swipe-left');
    setDragOffset({ x: 0, y: 0 });

    setTimeout(() => {
      setHistory((prev) => [...prev, { index: currentIndex, direction, card: currentCard }]);

      if (direction === 'right') {
        setSavedParties((prev) => {
          if (prev.some((p) => p.id === currentCard.id)) return prev;
          return [...prev, currentCard];
        });
      }

      setCurrentIndex((prev) => prev + 1);
      setAnimClass('');
    }, 340);
  };

  // --- UNDO / REWIND ACTION ---
  const handleUndo = () => {
    if (history.length === 0 || animClass) return;
    const lastAction = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));
    if (lastAction.direction === 'right') {
      setSavedParties((prev) => prev.filter((p) => p.id !== lastAction.card.id));
    }

    setCurrentIndex(lastAction.index);
    setAnimClass('rewind-in');
    setTimeout(() => setAnimClass(''), 350);
  };
const pickSuitableEvent = (criteria = surpriseCriteria) => {
  const pool = filteredEvents.length > 0 ? filteredEvents : events;
  if (pool.length === 0) return;

  setIsRolling(true);
  setSurpriseCriteria(criteria);

  let candidates = [...pool];
  if (criteria === 'budget') {
    candidates = pool.filter((e) => e.price <= 15);
  } else if (criteria === 'closest') {
    candidates = [...pool].sort((a, b) => a.distanceMiles - b.distanceMiles).slice(0, 2);
  }
  if (candidates.length === 0) candidates = pool;

  let ticks = 0;
  const interval = setInterval(() => {
    const randomPreview = pool[Math.floor(Math.random() * pool.length)];
    setSurpriseEvent(randomPreview);
    ticks += 1;

    if (ticks >= 6) {
      clearInterval(interval);
      const others = candidates.filter((c) => c.id !== surpriseEvent?.id);
      const finalPick =
        others.length > 0
          ? others[Math.floor(Math.random() * others.length)]
          : candidates[Math.floor(Math.random() * candidates.length)];

      setSurpriseEvent(finalPick);
      setIsRolling(false);
    }
  }, 90);
};
  // --- SURPRISE ME SHUFFLE ANIMATION ---
  const handleSurpriseMe = () => {
  setSurpriseModalOpen(true);
  pickSuitableEvent(surpriseCriteria);
};

const handleAcceptSurprise = () => {
  if (!surpriseEvent) return;
  setSavedParties((prev) => {
    if (prev.some((p) => p.id === surpriseEvent.id)) return prev;
    return [...prev, surpriseEvent];
  });
  setSurpriseModalOpen(false);
  navigate(`/events/${surpriseEvent.id}`);
};

  // --- KEYBOARD ARROWS SUPPORT (<- Pass • Save ->) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') triggerSwipe('left');
      if (e.key === 'ArrowRight') triggerSwipe('right');
      if (e.key === 'Backspace') handleUndo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // --- TOUCH & MOUSE DRAG HANDLERS ---
  const handlePointerDown = (e) => {
    if (!currentCard || animClass) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = (e.clientY - dragStartRef.current.y) * 0.25;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 110) {
      triggerSwipe('right');
    } else if (dragOffset.x < -110) {
      triggerSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 }); // Snap smoothly back to center
    }
  };

  // Dynamic inline transform while dragging
  const dragStyle = isDragging
    ? {
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.06}deg)`,
        transition: 'none'
      }
    : {};

  const dragStampOpacity = Math.min(Math.abs(dragOffset.x) / 100, 1);

  return (
    <div className="aftr-shell">
      {/* ================= LEFT SIDEBAR (Desktop Only) ================= */}
      <aside className="aftr-sidebar">
        <div className="brand-block">
          <div className="brand-logo">
            aftr<span className="neon-dot">.</span>
          </div>
          <p className="brand-sub">GO OUT. FIND YOUR PEOPLE.</p>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">🧭</span>
            <span>Discover</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/my-tickets')}>
            <span className="nav-icon">♡</span>
            <span>Saved nights</span>
            <span className="nav-badge">
              {savedParties.length} • ${totalSavedDamage}
            </span>
          </button>
          <button className="nav-item" onClick={() => navigate('/my-tickets')}>
            <span className="nav-icon">🎟️</span>
            <span>My tickets</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/explore')}>
            <span className="nav-icon">🗺️</span>
            <span>Explore map</span>
          </button>
        </nav>

        <div className="host-cta-card sidebar-host-card">
          <h4>Make it a night.</h4>
          <p>Bring your people together. We'll bring the good vibes.</p>
          <button className="host-link-btn" onClick={() => navigate('/host')}>
            <span>Host a party</span>
            <span>→</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="help-btn">? Help & feedback</button>
          <div className="user-mini-profile">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
              alt="Jamie Miller"
              className="avatar-img"
            />
            <div>
              <strong>Jamie Miller</strong>
              <span>Your next story awaits</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="aftr-main">
        {/* TOP HEADER BAR */}
        <header className="aftr-topbar">
          <div className="topbar-left">
            <span className="mobile-brand">
              aftr<span className="neon-dot">.</span>
            </span>
            <button className="location-pill">
              <span className="loc-pin">📍</span> Brooklyn, New York <span>▾</span>
            </button>
          </div>

          <div className="topbar-right">
            <span className="spontaneous-text">A little spontaneous looks good on you.</span>
            <button className="notif-btn" aria-label="Notifications">
              🔔<span className="notif-dot"></span>
            </button>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
              alt="Profile"
              className="topbar-avatar"
            />
          </div>
        </header>

        {/* TABLET & MOBILE HORIZONTAL NAV BAR */}
        <nav className="compact-nav">
          <button className="compact-tab active">
            <span className="tab-icon">🧭</span>
            <span className="tab-label">Discover</span>
          </button>
          <button className="compact-tab" onClick={() => navigate('/my-tickets')}>
            <div className="icon-badge-wrap">
              <span className="tab-icon">♡</span>
              <span className="mini-count">{savedParties.length}</span>
            </div>
            <span className="tab-label">Saved (${totalSavedDamage})</span>
          </button>
          <button className="compact-tab" onClick={() => navigate('/my-tickets')}>
            <span className="tab-icon">🎟️</span>
            <span className="tab-label">My tickets</span>
          </button>
          <button className="compact-tab" onClick={() => navigate('/explore')}>
            <span className="tab-icon">🗺️</span>
            <span className="tab-label">Explore map</span>
          </button>
        </nav>

        {/* HERO TITLE + SURPRISE ME + FILTER PILLS */}
        <section className="hero-filter-section">
          <div className="hero-title-row">
            <div>
              <h1>Find your kind of night.</h1>
              <p>Less scrolling. More stories worth telling.</p>
            </div>
            <button className="surprise-btn" onClick={handleSurpriseMe}>
              <span>🎲</span> Surprise me
            </button>
          </div>

          <div className="filter-pills-row">
            <button className="f-pill active-tonight">Tonight</button>
            <button
              className={`f-pill ${within5Mi ? 'active-pill' : ''}`}
              onClick={() => {
                setWithin5Mi(!within5Mi);
                setCurrentIndex(0);
              }}
            >
              Within 5 mi
            </button>
            <button
              className={`f-pill ${activeVibe !== 'All vibes' ? 'active-pill' : ''}`}
              onClick={() => {
                const vibes = ['All vibes', 'House', 'Techno', 'Disco', 'Rooftop'];
                const next = vibes[(vibes.indexOf(activeVibe) + 1) % vibes.length];
                setActiveVibe(next);
                setCurrentIndex(0);
              }}
            >
              {activeVibe}
            </button>
            <button
              className={`f-pill ${freeOnly ? 'active-pill' : ''}`}
              onClick={() => {
                setFreeOnly(!freeOnly);
                setCurrentIndex(0);
              }}
            >
              {freeOnly ? 'Free only' : 'Any price'}
            </button>
            <button className="f-pill" onClick={() => navigate('/explore')}>
              ⇄ Filters
            </button>
          </div>
        </section>

        {/* TWO-COLUMN DASHBOARD GRID (Desktop) / STACKED (Tablet & Phone) */}
        <div className="discover-grid">
          {/* LEFT COLUMN: SWIPE DECK */}
          <div className="swipe-column">
            <div className="deck-meta-bar">
              <span>CURATED FOR YOUR ENERGY</span>
              <span>
                {filteredEvents.length > 0
                  ? `${String(currentIndex + 1).padStart(2, '0')} / ${String(filteredEvents.length).padStart(2, '0')}`
                  : '00 / 00'}
              </span>
            </div>

            <div className="card-stack-stage">
              {/* Background Next Card for Depth */}
              {nextCard && (
                <div
                  className="swipe-card next-card-preview"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.15) 0%, rgba(10,10,14,0.92) 85%), url(${nextCard.image})`
                  }}
                />
              )}

              {/* Active Top Swipe Card */}
              {currentCard ? (
                <div
                  className={`swipe-card active-card ${animClass}`}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.1) 0%, rgba(10,10,14,0.95) 82%), url(${currentCard.image})`,
                    ...dragStyle
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  {/* Dynamic Drag Stamps */}
                  {dragOffset.x > 25 && (
                    <div className="swipe-stamp stamp-in" style={{ opacity: dragStampOpacity }}>
                      I'M IN ♡
                    </div>
                  )}
                  {dragOffset.x < -25 && (
                    <div className="swipe-stamp stamp-pass" style={{ opacity: dragStampOpacity }}>
                      PASS ✕
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="card-top-Row">
                    <span className="tonight-pick-badge">{currentCard.pickLabel}</span>
                    <span className="cover-price-badge">
                      {currentCard.price === 0 ? 'Free' : `$${currentCard.price} cover`}
                    </span>
                  </div>

                  {/* Bottom Details */}
                  <div className="card-bottom-content">
                    <div className="card-tags">
                      {currentCard.tags.map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                      <span className="tag-chip spots-chip">🔥 {currentCard.spotsLeft} spots left</span>
                    </div>

                    <h2>{currentCard.title}</h2>
                    <p className="card-subtitle">{currentCard.subtitle}</p>

                    <div className="card-meta-bottom">
                      <div className="meta-lines">
                        <span>📍 {currentCard.venue} • {currentCard.distance}</span>
                        <span>🕒 {currentCard.time}</span>
                      </div>

                      <button
                        className="card-detail-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${currentCard.id}`);
                        }}
                        title="View event details & checkout"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-deck-box">
                  <h3>That's the whole lineup for tonight.</h3>
                  <p>Rewind your last pass or reset the deck to browse again.</p>
                  <button className="surprise-btn" onClick={() => setCurrentIndex(0)}>
                    Reset Deck
                  </button>
                </div>
              )}
            </div>

            {/* SWIPE CONTROLS (Undo, Pass, I'm In) */}
            <div className="deck-controls-wrap">
              <div className="deck-buttons">
                <button
                  className="ctrl-btn btn-undo"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  title="Undo last swipe"
                >
                  ↺
                </button>

                <div className="ctrl-group">
                  <button
                    className="ctrl-btn btn-pass"
                    onClick={() => triggerSwipe('left')}
                    disabled={!currentCard}
                  >
                    ✕
                  </button>
                  <span className="ctrl-label">PASS</span>
                </div>

                <div className="ctrl-group">
                  <button
                    className="ctrl-btn btn-imin"
                    onClick={() => triggerSwipe('right')}
                    disabled={!currentCard}
                  >
                    ♡
                  </button>
                  <span className="ctrl-label imin-label">I'M IN</span>
                </div>
              </div>

              <p className="keyboard-hint">← Pass  •  Save →</p>
            </div>
          </div>

          {/* RIGHT COLUMN: GOOD NIGHTS NEARBY & PROMO CARDS */}
          <div className="nearby-column">
            <div className="nearby-header-row">
              <div>
                <h3>Good nights nearby</h3>
                <p>A few more reasons to leave the couch.</p>
              </div>
              <button className="explore-outline-btn tablet-only-btn" onClick={() => navigate('/explore')}>
                Explore all nearby parties <span>→</span>
              </button>
            </div>

            <div className="nearby-cards-list">
              {events.slice(1, 3).map((item) => (
                <div
                  key={item.id}
                  className="nearby-mini-card"
                  onClick={() => navigate(`/events/${item.id}`)}
                >
                  <img src={item.image} alt={item.title} className="nearby-thumb" />
                  <div className="nearby-info">
                    <span className="nearby-genre">
                      {item.tags[0].toUpperCase()} • {item.neighborhood}
                    </span>
                    <h4>{item.title}</h4>
                    <span className="nearby-time">
                      {item.time.split('–')[0]} • {item.distance}
                    </span>
                    <span className="nearby-price">
                      {item.price === 0 ? 'Free' : `$${item.price}`}
                    </span>
                  </div>
                  <span className="nearby-chevron">›</span>
                </div>
              ))}
            </div>

            <button className="explore-outline-btn desktop-mobile-btn" onClick={() => navigate('/explore')}>
              <span>Explore all nearby parties</span>
              <span>→</span>
            </button>

            {/* BOTTOM PROMO GRID (Purple Card + Mobile/Tablet Host Card) */}
            <div className="promo-bento-grid">
              <div className="no-plans-card" onClick={handleSurpriseMe}>
                <div className="no-plans-content">
                  <span className="energy-pill">A LITTLE MAIN CHARACTER ENERGY</span>
                  <h3>No plans? Perfect.</h3>
                  <p>
                    The best nights usually start that way. Let a little luck pick where you end up.
                  </p>
                </div>
                <span className="sparkle-icon">✦</span>
              </div>

              <div className="host-cta-card responsive-host-card">
                <h4>Make it a night.</h4>
                <p>Bring your people together. We'll bring the good vibes.</p>
                <button className="host-link-btn" onClick={() => navigate('/host')}>
                  <span>Host a party</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <p className="story-footnote">◎ Real events. Local energy. Always a good story.</p>
          </div>
        </div>

        {/* PAGE FOOTER */}
        <footer className="aftr-footer">
          <span>GOOD PEOPLE. GREAT NIGHTS.</span>
          <span>Discover spontaneously. Party responsibly. 21+</span>
        </footer>
      </div>
    </div>
  );
}