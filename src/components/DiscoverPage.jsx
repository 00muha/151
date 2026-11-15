import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const PARTY_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571266028243-cb40fce756fd?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1545128485-c400e7702796?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&auto=format&fit=crop&q=80'
];

function generate60TonightEvents() {
  const zones = [
    { area: 'Westlands, Nairobi', neighborhood: 'WESTLANDS' },
    { area: 'Kilimani, Nairobi', neighborhood: 'KILIMANI' },
    { area: 'Karen, Nairobi', neighborhood: 'KAREN' },
    { area: 'Lavington, Nairobi', neighborhood: 'LAVINGTON' },
    { area: 'Kileleshwa, Nairobi', neighborhood: 'KILELESHWA' },
    { area: 'Ngong Road, Nairobi', neighborhood: 'NGONG RD' }
  ];

  const titles = [
    'Above the city.',
    'Basement frequencies',
    'Disco, not dead.',
    'Velvet Afterhours',
    'Skyline Amapiano Sundowner',
    'Westlands Bass Bunker',
    'Neon Rooftop Sessions',
    'Midnight Vinyl Society',
    'Subzero Warehouse Rave',
    'Afro-House & Sunset Grill',
    'Golden Hour Penthouse',
    'Underground Drill & Bass',
    'Secret Garden Nocturne',
    'Electric Mirage Night',
    'Boiler Room Nairobi Edition',
    'Lo-Fi & Cocktails Unplugged',
    'Afterdark Techno Syndicate',
    'Pulse 254 Rooftop',
    'Rhythm & Smoke Courtyard',
    'Eclipse Secret Pin Drop'
  ];

  const venues = [
    'The Alchemist Deck',
    'Kilimani Penthouse Loft',
    '1824 Secret Courtyard',
    'K1 Klubhouse Vault',
    'SkyLuxx Panorama Lounge',
    'Karen Oasis Villa',
    'Lavington Glasshouse',
    'B-Club VIP Terrace',
    'Muze Open Air',
    'The Sanctuary Rooftop'
  ];

  const vibePairs = [
    ['House', 'Rooftop'],
    ['Techno', 'Warehouse'],
    ['Amapiano', 'Afrobeats'],
    ['Disco', 'House'],
    ['Hip-Hop', 'Lounge'],
    ['Afrobeats', 'Rooftop']
  ];

  const subtitles = [
    'A rooftop, a sunset, and your new favorite DJ spinning till dawn.',
    'Raw industrial warehouse sound system and underground selectors all night.',
    'Vinyl-only grooves, mirrorballs, and zero pretension on the dancefloor.',
    'Late-night amapiano log drums, signature cocktails, and secret guest sets.',
    'Intimate penthouse energy with panoramic city lights and deep house cuts.',
    'High-voltage club edits, heavy basslines, and late-night street food.'
  ];

  const pickLabels = [
    "TONIGHT'S PICK",
    'CROWD FAVORITE',
    'UNDERGROUND PICK',
    'SECRET PIN',
    'FILLING FAST',
    'VIP CURATED'
  ];

  const kshPrices = [0, 500, 800, 1000, 1200, 1500, 2000, 2500, 3000];
  const startTimes = [
    'Tonight, 7 PM – late',
    'Tonight, 8 PM – late',
    'Tonight, 9 PM – 3 AM',
    'Tonight, 10 PM – 4 AM',
    'Tonight, 11 PM – dawn'
  ];

  return Array.from({ length: 60 }, (_, i) => {
    const zone = zones[i % zones.length];
    const baseTitle = titles[i % titles.length];
    const edition = i >= titles.length ? ` Vol. ${Math.floor(i / titles.length) + 1}` : '';
    const dist = Number((0.6 + ((i * 0.45) % 6.8)).toFixed(1));
    const price = kshPrices[i % kshPrices.length];
    const spotsLeft = 3 + ((i * 7) % 28);

    return {
      id: String(i + 1),
      city: zone.area,
      neighborhood: zone.neighborhood,
      pickLabel: pickLabels[i % pickLabels.length],
      title: `${baseTitle}${edition}`,
      subtitle: subtitles[i % subtitles.length],
      venue: `${venues[i % venues.length]} (${zone.neighborhood})`,
      distance: `${dist} km`,
      distanceKm: dist,
      time: startTimes[i % startTimes.length],
      price,
      tags: vibePairs[i % vibePairs.length],
      spotsLeft,
      image: PARTY_IMAGES[i % PARTY_IMAGES.length]
    };
  });
}

const SIXTY_EVENTS = generate60TonightEvents();

const LOCATIONS = [
  'All Nairobi Zones',
  'Westlands, Nairobi',
  'Kilimani, Nairobi',
  'Karen, Nairobi',
  'Lavington, Nairobi',
  'Kileleshwa, Nairobi',
  'Ngong Road, Nairobi'
];

const formatKsh = (amount) =>
  amount === 0 ? 'Free' : `KSh ${Number(amount).toLocaleString()}`;

export default function DiscoverPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState(SIXTY_EVENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [nearbyVisibleCount, setNearbyVisibleCount] = useState(10);

  const [savedParties, setSavedParties] = useState([
    SIXTY_EVENTS[0],
    SIXTY_EVENTS[1],
    SIXTY_EVENTS[3],
    SIXTY_EVENTS[4]
  ]);

  const [selectedLocation, setSelectedLocation] = useState('All Nairobi Zones');
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeVibe, setActiveVibe] = useState('All vibes');
  const [freeOnly, setFreeOnly] = useState(false);
  const [within5Km, setWithin5Km] = useState(false);

  const [animState, setAnimState] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const locationDropdownRef = useRef(null);

  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [surpriseEvent, setSurpriseEvent] = useState(null);
  const [surpriseCriteria, setSurpriseCriteria] = useState('fit');
  const [matchReason, setMatchReason] = useState('');
  const lastSurpriseIdRef = useRef(null);
  const rollIntervalRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/events')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length >= 10) {
          setEvents(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
        setLocationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesLocation =
        selectedLocation === 'All Nairobi Zones' ||
        ev.city.toLowerCase() === selectedLocation.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.neighborhood.toLowerCase().includes(q) ||
        ev.tags.some((t) => t.toLowerCase().includes(q));

      const matchesVibe =
        activeVibe === 'All vibes' ||
        ev.tags.some((t) => t.toLowerCase() === activeVibe.toLowerCase());

      const matchesPrice = !freeOnly || ev.price === 0;
      const matchesDistance = !within5Km || ev.distanceKm <= 5;

      return matchesLocation && matchesSearch && matchesVibe && matchesPrice && matchesDistance;
    });
  }, [events, selectedLocation, searchQuery, activeVibe, freeOnly, within5Km]);

  const currentCard = filteredEvents[currentIndex];
  const nextCard = filteredEvents[currentIndex + 1];
  const totalSavedKsh = savedParties.reduce((sum, item) => sum + (item.price || 0), 0);

  const triggerSwipe = (direction) => {
    if (!currentCard || animState) return;

    setAnimState(direction);
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
      setAnimState('');
    }, 300);
  };

  const handleUndo = () => {
    if (history.length === 0 || animState) return;
    const lastAction = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));
    if (lastAction.direction === 'right') {
      setSavedParties((prev) => prev.filter((p) => p.id !== lastAction.card.id));
    }

    setCurrentIndex(lastAction.index);
    setAnimState('rewind');
    setTimeout(() => setAnimState(''), 300);
  };

  const pickRandomSuitableEvent = (criteria = surpriseCriteria) => {
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

    const basePool = filteredEvents.length > 1 ? filteredEvents : events;
    setIsRolling(true);
    setSurpriseCriteria(criteria);

    const preferredTags = new Set(savedParties.flatMap((p) => p.tags || []));

    let candidates = [...basePool];
    let reasonText = 'Matched to your energy & saved vibes';

    if (criteria === 'fit') {
      const vibeMatches = basePool.filter((ev) =>
        ev.tags.some((t) => preferredTags.has(t))
      );
      if (vibeMatches.length > 1) {
        candidates = vibeMatches;
        reasonText = `Fits your ${Array.from(preferredTags).slice(0, 2).join(' & ')} taste`;
      }
    } else if (criteria === 'closest') {
      candidates = [...basePool]
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, Math.max(8, Math.floor(basePool.length * 0.25)));
      reasonText = 'Selected from the closest venues near you';
    } else if (criteria === 'budget') {
      candidates = basePool.filter((e) => e.price <= 1000);
      reasonText = 'Budget friendly • KSh 1,000 or less';
    } else if (criteria === 'free') {
      candidates = basePool.filter((e) => e.price === 0);
      reasonText = 'Zero cover charge tonight';
    }

    if (candidates.length === 0) {
      candidates = [...basePool];
      reasonText = 'Wildcard pick from all 60 plots tonight';
    }

    const nonRepeatingPool =
      candidates.length > 1
        ? candidates.filter((c) => c.id !== lastSurpriseIdRef.current)
        : candidates;

    const finalWinner =
      nonRepeatingPool[Math.floor(Math.random() * nonRepeatingPool.length)];
    lastSurpriseIdRef.current = finalWinner.id;

    let step = 0;
    rollIntervalRef.current = setInterval(() => {
      const randomPreview = basePool[Math.floor(Math.random() * basePool.length)];
      setSurpriseEvent(randomPreview);
      step += 1;

      if (step >= 7) {
        clearInterval(rollIntervalRef.current);
        setSurpriseEvent(finalWinner);
        setMatchReason(reasonText);
        setIsRolling(false);
      }
    }, 75);
  };

  const handleSurpriseMe = () => {
    setSurpriseModalOpen(true);
    pickRandomSuitableEvent(surpriseCriteria);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (surpriseModalOpen || document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') triggerSwipe('left');
      if (e.key === 'ArrowRight') triggerSwipe('right');
      if (e.key === 'Backspace') handleUndo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handlePointerDown = (e) => {
    if (!currentCard || animState) return;
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

    if (dragOffset.x > 105) {
      triggerSwipe('right');
    } else if (dragOffset.x < -105) {
      triggerSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const getCardTransform = () => {
    if (isDragging) {
      return {
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.06}deg)`,
        transition: 'none'
      };
    }
    if (animState === 'left') {
      return {
        transform: 'translate3d(-135%, 24px, 0) rotate(-18deg)',
        opacity: 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease'
      };
    }
    if (animState === 'right') {
      return {
        transform: 'translate3d(135%, 24px, 0) rotate(18deg)',
        opacity: 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease'
      };
    }
    return {
      transform: 'translate3d(0, 0, 0) rotate(0deg)',
      opacity: 1,
      transition: 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
    };
  };

  const dragStampOpacity = Math.min(Math.abs(dragOffset.x) / 95, 1);
  const nearbyListSource = filteredEvents.length > 0 ? filteredEvents : events;

  return (
    <div className="min-h-screen w-full bg-[#0b0c0e] text-[#f5f6f8] flex overflow-x-hidden">
      {/* ================= LEFT SIDEBAR (Desktop lg+) ================= */}
      <aside className="hidden lg:flex w-72 bg-[#0e1013] border-r border-white/10 px-6 py-8 flex-col shrink-0 sticky top-0 h-screen">
        <div className="px-2">
          <div className="text-3xl font-extrabold tracking-tight">
            aftr<span className="text-[#d2ff38]">.</span>
          </div>
          <p className="text-[10px] tracking-[1.8px] text-[#8b909a] mt-1.5 font-medium">
            GO OUT. FIND YOUR PEOPLE.
          </p>
        </div>

        <nav className="mt-10 flex flex-col gap-2.5">
          <button className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold bg-[#1e2418] text-[#d2ff38] cursor-pointer">
            <span>Discover</span>
          </button>

          <button
            onClick={() => navigate('/my-tickets')}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium text-[#8b909a] hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <span>Saved nights</span>
            <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">
              {savedParties.length} • {formatKsh(totalSavedKsh)}
            </span>
          </button>

          <button
            onClick={() => navigate('/my-tickets')}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium text-[#8b909a] hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <span>My tickets</span>
          </button>

          <button
            onClick={() => navigate('/explore')}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium text-[#8b909a] hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <span>Explore map</span>
          </button>
        </nav>

        <div className="mt-auto mb-8 bg-gradient-to-br from-[#1b2116] to-[#141812] border border-[#d2ff38]/20 rounded-2xl p-5">
          <h4 className="text-base font-bold mb-1.5">Make it a night.</h4>
          <p className="text-xs text-[#8b909a] leading-relaxed mb-4">
            Bring your people together. We'll bring the good vibes.
          </p>
          <button
            onClick={() => navigate('/host')}
            className="w-full flex items-center justify-between text-[#d2ff38] text-xs font-bold pt-1 cursor-pointer hover:underline"
          >
            <span>Host a party</span>
            <span>→</span>
          </button>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col gap-4 px-1">
          <button
            onClick={() => navigate('/help')}
            className="text-xs text-[#8b909a] text-left hover:text-white cursor-pointer"
          >
            Help & feedback
          </button>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
              alt="Jamie Miller"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <strong className="block text-xs font-semibold">Jamie Miller</strong>
              <span className="text-[11px] text-[#8b909a]">Your next story awaits</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col px-5 py-6 sm:px-8 lg:px-12 max-w-[1340px] mx-auto w-full">
        {/* TOP HEADER BAR */}
        <header className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-4" ref={locationDropdownRef}>
            <span className="lg:hidden text-2xl font-extrabold tracking-tight">
              aftr<span className="text-[#d2ff38]">.</span>
            </span>

            <div className="relative">
              <button
                onClick={() => setLocationMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full cursor-pointer transition"
              >
                <span>{selectedLocation}</span>
                <span
                  className={`inline-block transition-transform ${
                    locationMenuOpen ? 'rotate-180 text-[#d2ff38]' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {locationMenuOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-64 bg-[#14171d] border border-[#d2ff38]/30 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-[#8b909a] px-3 py-1.5">
                    SWITCH TONIGHT'S ZONE ({events.length} PLOTS)
                  </span>
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setCurrentIndex(0);
                        setLocationMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left cursor-pointer transition ${
                        selectedLocation === loc
                          ? 'bg-[#1e2418] text-[#d2ff38] font-semibold'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && <span className="text-[#d2ff38]">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden lg:inline text-xs text-[#8b909a]">
              A little spontaneous looks good on you.
            </span>
            <button
              onClick={() => navigate('/notifications')}
              className="relative bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white cursor-pointer hover:bg-white/10"
            >
              Alerts
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#d2ff38] rounded-full" />
            </button>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
              alt="Profile"
              className="lg:hidden w-9 h-9 rounded-full object-cover"
            />
          </div>
        </header>

        {/* TABLET & MOBILE HORIZONTAL NAV BAR */}
        <nav className="lg:hidden grid grid-cols-4 gap-2.5 py-4 border-b border-white/10">
          <button className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-[#1e2418] text-[#d2ff38] text-xs font-semibold cursor-pointer">
            <span>Discover</span>
          </button>

          <button
            onClick={() => navigate('/my-tickets')}
            className="flex flex-col items-center justify-center py-2 px-2 rounded-xl text-[#8b909a] hover:bg-white/5 text-xs cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span>Saved nights</span>
              <span className="bg-white/15 text-white text-[10px] px-2 py-0.5 rounded-full">
                {savedParties.length}
              </span>
            </div>
            <span className="text-[11px] text-[#d2ff38] font-semibold mt-0.5">
              {formatKsh(totalSavedKsh)} Total
            </span>
          </button>

          <button
            onClick={() => navigate('/my-tickets')}
            className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl text-[#8b909a] hover:bg-white/5 text-xs cursor-pointer"
          >
            <span>My tickets</span>
          </button>

          <button
            onClick={() => navigate('/explore')}
            className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl text-[#8b909a] hover:bg-white/5 text-xs cursor-pointer"
          >
            <span>Explore map</span>
          </button>
        </nav>

        {/* HERO TITLE + SURPRISE ME + SEARCH + FILTER PILLS */}
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Find your kind of night.
              </h1>
              <p className="text-sm text-[#8b909a] mt-1.5">
                Less scrolling. More stories worth telling. Showing {filteredEvents.length} live plots tonight.
              </p>
            </div>

            <button
              onClick={handleSurpriseMe}
              className="w-full sm:w-auto bg-[#d2ff38] text-[#0b0c0e] font-bold text-sm px-7 py-3.5 rounded-full hover:brightness-110 active:scale-95 transition cursor-pointer shadow-[0_8px_24px_rgba(210,255,56,0.3)]"
            >
              Surprise me
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Search Box */}
            <div className="flex items-center bg-[#14171c] border border-white/10 focus-within:border-[#d2ff38]/60 rounded-full px-5 py-2.5 w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentIndex(0);
                }}
                placeholder="Search party, venue, or vibe..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder-[#8b909a] w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentIndex(0);
                  }}
                  className="text-xs text-[#8b909a] hover:text-white ml-2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <button className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#1e2418] text-[#d2ff38] border border-[#d2ff38]/40 cursor-pointer">
              Tonight
            </button>

            <button
              onClick={() => {
                setWithin5Km(!within5Km);
                setCurrentIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                within5Km
                  ? 'bg-[#1e2418] text-[#d2ff38] border-[#d2ff38]/40'
                  : 'bg-[#15181d] text-[#8b909a] border-white/10 hover:text-white'
              }`}
            >
              Within 5 km
            </button>

            <button
              onClick={() => {
                const vibes = ['All vibes', 'House', 'Techno', 'Amapiano', 'Disco', 'Afrobeats', 'Rooftop'];
                const next = vibes[(vibes.indexOf(activeVibe) + 1) % vibes.length];
                setActiveVibe(next);
                setCurrentIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                activeVibe !== 'All vibes'
                  ? 'bg-[#1e2418] text-[#d2ff38] border-[#d2ff38]/40'
                  : 'bg-[#15181d] text-[#8b909a] border-white/10 hover:text-white'
              }`}
            >
              {activeVibe}
            </button>

            <button
              onClick={() => {
                setFreeOnly(!freeOnly);
                setCurrentIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                freeOnly
                  ? 'bg-[#1e2418] text-[#d2ff38] border-[#d2ff38]/40'
                  : 'bg-[#15181d] text-[#8b909a] border-white/10 hover:text-white'
              }`}
            >
              {freeOnly ? 'Free Entry Only' : 'Any price (KSh)'}
            </button>

            <button
              onClick={() => navigate('/explore')}
              className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#15181d] text-[#8b909a] border border-white/10 hover:text-white cursor-pointer"
            >
              Filters
            </button>
          </div>
        </section>

        {/* ================= MAIN 2-COLUMN DASHBOARD GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 xl:gap-12 items-start">
          {/* LEFT COLUMN: SWIPE DECK */}
          <div className="w-full">
            <div className="flex justify-between text-xs tracking-widest text-[#8b909a] mb-3.5 font-medium">
              <span>CURATED FOR YOUR ENERGY</span>
              <span>
                {filteredEvents.length > 0 && currentCard
                  ? `${String(currentIndex + 1).padStart(2, '0')} / ${String(filteredEvents.length).padStart(2, '0')}`
                  : '00 / 00'}
              </span>
            </div>

            {/* Card Stack Stage */}
            <div className="relative w-full h-[470px] sm:h-[540px]">
              {nextCard && (
                <div
                  className="absolute inset-0 rounded-3xl bg-cover bg-center border border-white/10 scale-95 translate-y-4 opacity-55 brightness-75 transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.15) 0%, rgba(10,10,14,0.92) 85%), url(${nextCard.image})`
                  }}
                />
              )}

              {currentCard ? (
                <div
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.12) 0%, rgba(10,10,14,0.95) 82%), url(${currentCard.image})`,
                    ...getCardTransform()
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="absolute inset-0 z-10 rounded-3xl bg-cover bg-center p-6 sm:p-8 flex flex-col justify-between border border-white/15 shadow-2xl select-none touch-pan-y cursor-grab active:cursor-grabbing"
                >
                  {dragOffset.x > 25 && (
                    <div
                      style={{ opacity: dragStampOpacity }}
                      className="absolute top-20 left-8 border-2 border-[#d2ff38] text-[#d2ff38] bg-black/70 px-5 py-2 rounded-xl text-xl font-black tracking-widest -rotate-12 pointer-events-none"
                    >
                      I'M IN
                    </div>
                  )}
                  {dragOffset.x < -25 && (
                    <div
                      style={{ opacity: dragStampOpacity }}
                      className="absolute top-20 right-8 border-2 border-red-500 text-red-500 bg-black/70 px-5 py-2 rounded-xl text-xl font-black tracking-widest rotate-12 pointer-events-none"
                    >
                      PASS
                    </div>
                  )}

                  {/* Top Row Badges */}
                  <div className="flex items-center justify-between">
                    <span className="bg-[#d2ff38] text-[#0b0c0e] text-xs font-extrabold px-4 py-1.5 rounded-full">
                      {currentCard.pickLabel}
                    </span>
                    <span className="bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15">
                      {currentCard.price === 0 ? 'Free Entry' : `${formatKsh(currentCard.price)} cover`}
                    </span>
                  </div>

                  {/* Bottom Card Details */}
                  <div>
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {currentCard.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/15 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="bg-[#d2ff38]/20 text-[#d2ff38] border border-[#d2ff38]/35 text-xs px-3.5 py-1.5 rounded-full font-semibold">
                        {currentCard.spotsLeft} spots left
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                      {currentCard.title}
                    </h2>
                    <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                      {currentCard.subtitle}
                    </p>

                    <div className="flex items-end justify-between pt-2 border-t border-white/10">
                      <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-gray-300">
                        <span>
                          {currentCard.venue} • {currentCard.distance}
                        </span>
                        <span>{currentCard.time}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${currentCard.id}`);
                        }}
                        title="Open event profile"
                        className="w-11 h-11 rounded-full bg-white/15 hover:bg-[#d2ff38] hover:text-[#0b0c0e] border border-white/20 text-white flex items-center justify-center transition cursor-pointer"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full rounded-3xl bg-[#131519] border border-dashed border-white/15 flex flex-col items-center justify-center text-center p-10 gap-4">
                  <h3 className="text-xl font-bold">You've reached the end of this filter.</h3>
                  <p className="text-sm text-[#8b909a] max-w-xs">
                    Reset your filters to browse all 60 live Nairobi plots tonight.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setSearchQuery('');
                      setActiveVibe('All vibes');
                      setFreeOnly(false);
                      setWithin5Km(false);
                      setSelectedLocation('All Nairobi Zones');
                    }}
                    className="mt-2 bg-[#d2ff38] text-[#0b0c0e] font-bold text-xs px-6 py-3 rounded-full cursor-pointer"
                  >
                    Reset All 60 Places
                  </button>
                </div>
              )}
            </div>

            {/* Swipe Action Buttons */}
            <div className="flex flex-col items-center mt-8">
              <div className="flex items-start gap-7">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  title="Undo last swipe"
                  className="w-12 h-12 mt-3 rounded-full bg-[#15181e] border border-white/10 text-[#8b909a] hover:text-white disabled:opacity-40 flex items-center justify-center text-lg cursor-pointer transition active:scale-90"
                >
                  ↺
                </button>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => triggerSwipe('left')}
                    disabled={!currentCard}
                    className="w-16 h-16 rounded-full bg-[#171a20] border border-white/10 text-white flex items-center justify-center text-xl cursor-pointer transition hover:bg-white/10 active:scale-90"
                  >
                    ✕
                  </button>
                  <span className="text-[11px] font-bold tracking-widest text-[#8b909a]">PASS</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => triggerSwipe('right')}
                    disabled={!currentCard}
                    className="w-18 h-18 rounded-full bg-[#d2ff38] text-[#0b0c0e] flex items-center justify-center text-2xl font-bold cursor-pointer shadow-[0_8px_25px_rgba(210,255,56,0.35)] transition hover:brightness-110 active:scale-90"
                  >
                    ♡
                  </button>
                  <span className="text-[11px] font-bold tracking-widest text-[#d2ff38]">
                    I'M IN
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#8b909a] mt-4">← Pass • Save →</p>
            </div>
          </div>

          {/* RIGHT COLUMN: SCROLLABLE "GOOD NIGHTS NEARBY" (60 PLACES) + PROMO CARDS */}
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Good nights nearby</h3>
                <p className="text-xs text-[#8b909a] mt-1">
                  Showing {Math.min(nearbyVisibleCount, nearbyListSource.length)} of {nearbyListSource.length} tonight's spots.
                </p>
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="hidden sm:inline-flex lg:hidden items-center gap-2 text-xs font-semibold border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/5 cursor-pointer"
              >
                Explore all <span>→</span>
              </button>
            </div>

            {/* Scrollable Nearby Feed */}
            <div className="max-h-[440px] overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {nearbyListSource.slice(0, nearbyVisibleCount).map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const deckIdx = filteredEvents.findIndex((e) => e.id === item.id);
                    if (deckIdx !== -1) {
                      setCurrentIndex(deckIdx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      navigate(`/events/${item.id}`);
                    }
                  }}
                  className={`flex items-center gap-4 bg-[#131519] border p-4 rounded-2xl cursor-pointer transition hover:-translate-y-0.5 ${
                    currentCard?.id === item.id
                      ? 'border-[#d2ff38]/60 bg-[#181c14]'
                      : 'border-white/10 hover:border-[#d2ff38]/35'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#d2ff38] truncate">
                      #{idx + 1} • {item.tags[0].toUpperCase()} • {item.neighborhood}
                    </span>
                    <h4 className="text-base font-bold text-white truncate">{item.title}</h4>
                    <span className="block text-xs text-[#8b909a] truncate">
                      {item.time.split('–')[0]} • {item.distance}
                    </span>
                    <span className="block text-xs font-bold text-[#d2ff38]">
                      {formatKsh(item.price)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${item.id}`);
                    }}
                    className="text-lg text-[#8b909a] hover:text-[#d2ff38] px-2 py-1"
                    title="Open event page"
                  >
                    ›
                  </button>
                </div>
              ))}
            </div>

            {nearbyVisibleCount < nearbyListSource.length && (
              <button
                onClick={() =>
                  setNearbyVisibleCount((prev) => Math.min(prev + 12, nearbyListSource.length))
                }
                className="w-full mt-4 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#d2ff38] cursor-pointer transition"
              >
                Load more tonight's parties ({nearbyListSource.length - nearbyVisibleCount} remaining)
              </button>
            )}

            <button
              onClick={() => navigate('/explore')}
              className="w-full my-5 py-4 px-6 rounded-full border border-white/10 hover:border-white/25 text-xs font-semibold flex items-center justify-between cursor-pointer transition"
            >
              <span>Explore all nearby parties</span>
              <span>→</span>
            </button>

            {/* Promo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div
                onClick={handleSurpriseMe}
                className="bg-gradient-to-br from-[#221c38] to-[#171426] border border-purple-400/25 rounded-2xl p-6 cursor-pointer hover:border-purple-400/50 transition"
              >
                <span className="inline-block bg-white/10 text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full mb-3">
                  A LITTLE MAIN CHARACTER ENERGY
                </span>
                <h3 className="text-xl font-bold mb-1.5">No plans? Perfect.</h3>
                <p className="text-xs text-purple-200/75 leading-relaxed">
                  The best nights usually start that way. Tap to let luck pick a random match from tonight's {events.length} spots.
                </p>
              </div>

              <div className="lg:hidden bg-gradient-to-br from-[#1b2116] to-[#141812] border border-[#d2ff38]/20 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold mb-1.5">Make it a night.</h4>
                  <p className="text-xs text-[#8b909a] leading-relaxed mb-4">
                    Bring your people together. We'll bring the good vibes.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/host')}
                  className="w-full flex items-center justify-between text-[#d2ff38] text-xs font-bold cursor-pointer"
                >
                  <span>Host a party</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#8b909a] mt-5">
              Real events. Local energy. Always a good story.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8b909a]">
          <span>GOOD PEOPLE. GREAT NIGHTS.</span>
          <span>Discover spontaneously. Party responsibly. 21+</span>
        </footer>
      </div>

      {/* ================= SURPRISE ME MODAL ================= */}
      {surpriseModalOpen && surpriseEvent && (
        <div
          onClick={() => setSurpriseModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#12141a] border border-[#d2ff38]/30 rounded-3xl p-7 shadow-2xl"
          >
            <button
              onClick={() => setSurpriseModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <span className="inline-block bg-white/10 text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full mb-2.5">
              TONIGHT'S FATE PICKER
            </span>
            <h2 className="text-2xl font-extrabold">
              {isRolling ? 'Scanning 60 live plots...' : 'We found your spot.'}
            </h2>
            <p className="text-xs text-[#d2ff38] mt-1 mb-5">
              {isRolling ? 'Matching your vibe & budget...' : matchReason}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {[
                { key: 'fit', label: 'Best Fit' },
                { key: 'closest', label: 'Closest' },
                { key: 'budget', label: 'Under KSh 1K' },
                { key: 'free', label: 'Free Entry' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => pickRandomSuitableEvent(item.key)}
                  className={`py-2.5 px-3 rounded-full text-xs font-semibold border transition cursor-pointer ${
                    surpriseCriteria === item.key
                      ? 'bg-[#1e2418] text-[#d2ff38] border-[#d2ff38]/50'
                      : 'bg-[#181b22] text-[#8b909a] border-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(11,12,14,0.15) 0%, rgba(11,12,14,0.96) 80%), url(${surpriseEvent.image})`
              }}
              className={`h-80 rounded-2xl bg-cover bg-center p-5 flex flex-col justify-between border border-white/15 mb-6 transition-all duration-200 ${
                isRolling ? 'blur-[2px] scale-95 brightness-125' : 'scale-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="bg-[#d2ff38] text-[#0b0c0e] text-[11px] font-extrabold px-3.5 py-1 rounded-full">
                  PLOT #{surpriseEvent.id} • VIBE MATCH
                </span>
                <span className="bg-black/75 text-white text-xs font-semibold px-3.5 py-1 rounded-full border border-white/15">
                  {surpriseEvent.price === 0
                    ? 'Free Entry'
                    : `${formatKsh(surpriseEvent.price)} cover`}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {surpriseEvent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/15 text-white text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="bg-[#d2ff38]/20 text-[#d2ff38] text-xs px-3 py-1 rounded-full font-semibold">
                    {surpriseEvent.spotsLeft} spots left
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-1.5">
                  {surpriseEvent.title}
                </h3>
                <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                  {surpriseEvent.subtitle}
                </p>

                <div className="flex justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
                  <span>
                    {surpriseEvent.venue} ({surpriseEvent.distance})
                  </span>
                  <span>{surpriseEvent.time}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => pickRandomSuitableEvent(surpriseCriteria)}
                disabled={isRolling}
                className="sm:flex-1 py-3.5 rounded-full bg-[#1a1d24] hover:bg-[#232730] border border-white/10 text-xs font-semibold text-white cursor-pointer transition"
              >
                Spin Another Match
              </button>
              <button
                onClick={handleAcceptSurprise}
                disabled={isRolling}
                className="sm:flex-1 py-3.5 rounded-full bg-[#d2ff38] text-[#0b0c0e] text-xs font-extrabold cursor-pointer shadow-[0_8px_25px_rgba(210,255,56,0.3)] hover:brightness-110 transition"
              >
                I'm In — Lock Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}