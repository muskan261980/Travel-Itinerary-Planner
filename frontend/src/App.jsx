

import { useState } from 'react'
import './App.css'

const destinations = [
  {
    name: 'Manali',
    country: 'Himachal Pradesh, India',
    days: '3–5 days',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
    tag: 'Mountain escape',
  },
  {
    name: 'Goa',
    country: 'India',
    days: '3–4 days',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=85',
    tag: 'Beach getaway',
  },
  {
    name: 'Jaipur',
    country: 'Rajasthan, India',
    days: '2–3 days',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=85',
    tag: 'Culture & heritage',
  },
]

const interestOptions = [
  'Nature',
  'Food',
  'Adventure',
  'History',
  'Shopping',
  'Relaxation',
]

const budgetLabels = {
  accommodationINR: 'Accommodation',
  foodINR: 'Food',
  transportINR: 'Transport',
  activitiesINR: 'Activities',
  miscellaneousINR: 'Miscellaneous',
}

function formatINR(value) {
  const amount = Number(value)
  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString('en-IN')}`
    : '—'
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('3')
  const [budget, setBudget] = useState('10000')
  const [travellers, setTravellers] = useState('2')
  const [travelStyle, setTravelStyle] = useState('Adventure')
  const [interests, setInterests] = useState(['Nature'])
  const [itinerary, setItinerary] = useState(null)
  const [savedPlaces, setSavedPlaces] = useState([])

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    )
  }

  function toggleSavedPlace(name) {
    setSavedPlaces((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    )
  }

  async function planTrip(event) {
    event.preventDefault()

    if (!destination.trim()) {
      alert('Please enter your destination first.')
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/plan-trip`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: destination.trim(),
            days: Number(duration),
            budget: Number(budget),
            travellers: Number(travellers),
            travelStyle,
            interests,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to plan your trip.'
        )
      }

      const trip = data.trip
      const ai = trip.itinerary || {}

      setItinerary({
        destination: trip.destination || destination.trim(),
        days: trip.days ?? Number(duration),
        budget: trip.budget ?? Number(budget),
        travellers: trip.travellers ?? Number(travellers),
        style: trip.travelStyle || trip.style || travelStyle,
        interests: trip.interests || interests,
        summary: ai.summary || '',
        itinerary: Array.isArray(ai.days) ? ai.days : [],
        budgetBreakdown: ai.budgetBreakdown || null,
        travelTips: Array.isArray(ai.travelTips) ? ai.travelTips : [],
      })

      setActivePage('My Trips')
    } catch (error) {
      console.error('Error planning trip:', error)
      alert(
        error.message ||
          'Could not connect to the backend. Please check that Flask is running.'
      )
    }
  }

  function chooseDestination(name) {
    setDestination(name)
    setActivePage('Plan a Trip')
    setItinerary(null)
  }

  const pageTitles = {
    Dashboard: 'Discover your next adventure',
    'Plan a Trip': 'Let’s plan your getaway',
    'My Trips': 'Your travel collection',
    'Saved Places': 'Places worth remembering',
  }

  const savedDestinationList = destinations.filter((place) =>
    savedPlaces.includes(place.name)
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#dashboard"
          onClick={(event) => {
            event.preventDefault()
            setActivePage('Dashboard')
          }}
        >
          <span className="brand-icon">✈</span>
          Travel<span>Mate</span>
          <span className="brand-dot">.</span>
        </a>

        <div className="side-label">WORKSPACE</div>

        <nav className="nav-menu">
          {[
            ['Dashboard', '⌂'],
            ['Plan a Trip', '＋'],
            ['My Trips', '▤'],
            ['Saved Places', '♡'],
          ].map(([label, icon]) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? 'active' : ''
              }`}
              onClick={() => setActivePage(label)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
              {label === 'My Trips' && itinerary && (
                <span className="nav-count">1</span>
              )}
              {label === 'Saved Places' && savedPlaces.length > 0 && (
                <span className="nav-count">{savedPlaces.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-illustration">☁️</div>
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h3>The world is closer than you think.</h3>
          <p>Small plans. Big memories. Let's make them happen.</p>
          <button
            className="sidebar-cta"
            onClick={() => setActivePage('Plan a Trip')}
          >
            Start exploring <span>→</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <span className="avatar">T</span>
          <div>
            <strong>Travel Explorer</strong>
            <small>Your personal planner</small>
          </div>
          <span className="footer-dots">···</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>
          <div className="topbar-right">
            <span className="status-dot" />
            <span className="status-text">Ready to explore</span>
            <span className="top-avatar">T</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                YOUR PERSONAL TRAVEL ASSISTANT
              </div>
              <h1>{pageTitles[activePage]}</h1>
              <p className="page-subtitle">
                Your next great story starts with a destination.
              </p>
            </div>
            <div className="welcome-sparkle">✳</div>
          </section>

          {activePage === 'Dashboard' && (
            <>
              <section className="hero-banner">
                <div className="hero-orb orb-one" />
                <div className="hero-orb orb-two" />

                <div className="hero-content">
                  <span className="hero-badge">
                    ✦ YOUR NEXT ADVENTURE AWAITS
                  </span>
                  <h2>
                    Less planning.
                    <br />
                    More wandering.
                  </h2>
                  <p>
                    Create a trip that feels like you, built around
                    your budget, interests and travel style.
                  </p>
                  <button
                    className="hero-button"
                    onClick={() => setActivePage('Plan a Trip')}
                  >
                    Plan my trip <span>→</span>
                  </button>
                </div>

                <div className="hero-art" aria-hidden="true">
                  <div className="art-sun" />
                  <div className="art-mountain mountain-back" />
                  <div className="art-mountain mountain-front" />
                  <span className="art-plane">✈</span>
                  <span className="art-star star-one">✦</span>
                  <span className="art-star star-two">✧</span>
                </div>
                <span className="hero-caption">
                  GO WHERE YOU FEEL ALIVE.
                </span>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">HANDPICKED FOR YOU</div>
                    <h2>Find your happy place</h2>
                    <p>Somewhere new is calling your name.</p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => setActivePage('Plan a Trip')}
                  >
                    Explore all <span>→</span>
                  </button>
                </div>

                <div className="destination-grid">
                  {destinations.map((place) => {
                    const isSaved = savedPlaces.includes(place.name)

                    return (
                      <article
                        className="destination-card"
                        key={place.name}
                      >
                        <div className="destination-image">
                          <img src={place.image} alt={place.name} />
                          <span className="destination-tag">
                            {place.tag}
                          </span>
                          <button
                            className="save-button"
                            aria-label={
                              isSaved
                                ? `Remove ${place.name} from saved places`
                                : `Save ${place.name}`
                            }
                            aria-pressed={isSaved}
                            onClick={() => toggleSavedPlace(place.name)}
                          >
                            {isSaved ? '♥' : '♡'}
                          </button>
                        </div>

                        <div className="destination-info">
                          <div>
                            <h3>{place.name}</h3>
                            <p>{place.country}</p>
                          </div>
                          <span className="destination-days">
                            ◷ {place.days}
                          </span>
                        </div>

                        <button
                          className="destination-link"
                          onClick={() => chooseDestination(place.name)}
                        >
                          Plan this trip <span>↗</span>
                        </button>
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="quick-plan">
                <div className="quick-plan-icon">✦</div>
                <div>
                  <h3>Already have a destination in mind?</h3>
                  <p>
                    Tell us where you're headed and start building
                    your itinerary.
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setActivePage('Plan a Trip')}
                >
                  Build my itinerary →
                </button>
              </section>
            </>
          )}

          {activePage === 'Plan a Trip' && (
            <section className="form-card">
              <div className="form-heading">
                <span className="form-step">STEP 01 — YOUR TRIP</span>
                <h2>Let's make it unforgettable.</h2>
                <p>Start with the basics. You can change them anytime.</p>
              </div>

              <form onSubmit={planTrip}>
                <div className="field-group">
                  <label htmlFor="destination">
                    Where do you want to go?
                  </label>
                  <div className="input-with-icon">
                    <span>⌖</span>
                    <input
                      id="destination"
                      value={destination}
                      onChange={(event) =>
                        setDestination(event.target.value)
                      }
                      placeholder="e.g. Manali, Goa, Jaipur..."
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field-group">
                    <label htmlFor="duration">Duration</label>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(event) =>
                        setDuration(event.target.value)
                      }
                    >
                      {[1, 2, 3, 4, 5, 7, 10, 14].map((day) => (
                        <option key={day} value={day}>
                          {day} {day === 1 ? 'day' : 'days'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label htmlFor="budget">Total budget (₹)</label>
                    <input
                      id="budget"
                      type="number"
                      min="1"
                      value={budget}
                      onChange={(event) =>
                        setBudget(event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="travellers">Travellers</label>
                    <select
                      id="travellers"
                      value={travellers}
                      onChange={(event) =>
                        setTravellers(event.target.value)
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                        <option key={number} value={number}>
                          {number}{' '}
                          {number === 1 ? 'traveller' : 'travellers'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label htmlFor="style">Travel style</label>
                    <select
                      id="style"
                      value={travelStyle}
                      onChange={(event) =>
                        setTravelStyle(event.target.value)
                      }
                    >
                      {[
                        'Adventure',
                        'Relaxation',
                        'Luxury',
                        'Budget',
                        'Cultural',
                        'Family',
                      ].map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-group interests-group">
                  <label>What are you into?</label>
                  <p className="field-hint">
                    Choose all that match your vibe.
                  </p>
                  <div className="interest-list">
                    {interestOptions.map((interest) => (
                      <button
                        type="button"
                        key={interest}
                        className={`interest-chip ${
                          interests.includes(interest) ? 'selected' : ''
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interests.includes(interest) ? '✓' : '+'}{' '}
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <span className="form-note">
                    ✦ Your adventure starts here
                  </span>
                  <button
                    className="primary-button submit-button"
                    type="submit"
                  >
                    Create my itinerary <span>→</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {activePage === 'My Trips' && (
            <section className="empty-state">
              {itinerary ? (
                <div className="itinerary-result">
                  <span className="result-icon">✈</span>
                  <span className="eyebrow">YOUR TRIP SUMMARY</span>
                  <h2>{itinerary.destination} is calling!</h2>

                  <p className="result-description">
                    {itinerary.summary ||
                      "Your personalized travel plan is ready. Here's your trip at a glance."}
                  </p>

                  <div className="summary-grid">
                    <div>
                      <span>Duration</span>
                      <strong>{itinerary.days} days</strong>
                    </div>
                    <div>
                      <span>Budget</span>
                      <strong>{formatINR(itinerary.budget)}</strong>
                    </div>
                    <div>
                      <span>Travellers</span>
                      <strong>{itinerary.travellers}</strong>
                    </div>
                    <div>
                      <span>Travel style</span>
                      <strong>{itinerary.style}</strong>
                    </div>
                  </div>

                  <div className="result-interests">
                    <span>Interests</span>
                    <div className="interest-list">
                      {itinerary.interests?.length ? (
                        itinerary.interests.map((interest) => (
                          <span
                            className="interest-chip selected"
                            key={interest}
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span>Not selected</span>
                      )}
                    </div>
                  </div>

                  <div className="day-plans">
                    <div className="eyebrow">YOUR DAILY ADVENTURE</div>
                    <h2>Day-by-day itinerary</h2>

                    {itinerary.itinerary.length > 0 ? (
                      itinerary.itinerary.map((day, index) => (
                        <article
                          className="day-card"
                          key={day.day || index}
                        >
                          <h3>
                            Day {day.day || index + 1}
                            {day.title ? ` — ${day.title}` : ''}
                          </h3>

                          {day.description && <p>{day.description}</p>}

                          {Array.isArray(day.activities) &&
                          day.activities.length > 0 ? (
                            day.activities.map((activity, activityIndex) => {
                              const isObject =
                                activity !== null &&
                                typeof activity === 'object'

                              return (
                                <div
                                  className="activity-item"
                                  key={activityIndex}
                                >
                                  <strong>
                                    {isObject
                                      ? activity.time || 'Activity'
                                      : activity}
                                  </strong>

                                  {isObject && (
                                    <>
                                      {activity.activity && (
                                        <p>{activity.activity}</p>
                                      )}

                                      {activity.description && (
                                        <p>{activity.description}</p>
                                      )}

                                      {activity.location && (
                                        <p>📍 {activity.location}</p>
                                      )}

                                      {activity.estimatedCostINR != null && (
                                        <p>
                                          Estimated cost:{' '}
                                          {formatINR(
                                            activity.estimatedCostINR
                                          )}
                                        </p>
                                      )}

                                      {activity.cost != null &&
                                        activity.estimatedCostINR == null && (
                                          <p>
                                            Estimated cost:{' '}
                                            {formatINR(activity.cost)}
                                          </p>
                                        )}
                                    </>
                                  )}
                                </div>
                              )
                            })
                          ) : (
                            <p>
                              {typeof day.activities === 'string'
                                ? day.activities
                                : 'No activities listed for this day.'}
                            </p>
                          )}
                        </article>
                      ))
                    ) : (
                      <p>
                        No daily activities were returned. Please try
                        generating your itinerary again.
                      </p>
                    )}
                  </div>

                  {itinerary.budgetBreakdown &&
                    Object.keys(itinerary.budgetBreakdown).length > 0 && (
                      <section className="day-plans">
                        <div className="eyebrow">PLAN YOUR SPENDING</div>
                        <h2>Estimated budget breakdown</h2>
                        <p>
                          These are AI-generated estimates, not live prices.
                        </p>

                        <div className="summary-grid">
                          {Object.entries(budgetLabels).map(
                            ([key, label]) =>
                              itinerary.budgetBreakdown[key] != null && (
                                <div key={key}>
                                  <span>{label}</span>
                                  <strong>
                                    {formatINR(
                                      itinerary.budgetBreakdown[key]
                                    )}
                                  </strong>
                                </div>
                              )
                          )}
                        </div>

                        <div className="activity-item">
                          <strong>Total trip budget</strong>
                          <p>{formatINR(itinerary.budget)}</p>
                        </div>
                      </section>
                    )}

                  {itinerary.travelTips.length > 0 && (
                    <section className="day-plans">
                      <div className="eyebrow">TRAVEL SMART</div>
                      <h2>Tips for your trip</h2>
                      <ul>
                        {itinerary.travelTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <button
                    className="primary-button"
                    onClick={() => setActivePage('Plan a Trip')}
                  >
                    Edit trip details →
                  </button>
                </div>
              ) : (
                <>
                  <div className="empty-illustration">✈</div>
                  <h2>Your travel story starts here.</h2>
                  <p>
                    You haven't planned a trip yet. Let's change that!
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => setActivePage('Plan a Trip')}
                  >
                    Plan your first trip →
                  </button>
                </>
              )}
            </section>
          )}

          {activePage === 'Saved Places' && (
            <section className="section-block saved-section">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">YOUR WISHLIST</div>
                  <h2>Dream destinations</h2>
                  <p>
                    Choose a place and start planning your next escape.
                  </p>
                </div>
              </div>

              {savedDestinationList.length > 0 ? (
                <div className="destination-grid">
                  {savedDestinationList.map((place) => (
                    <article
                      className="destination-card"
                      key={place.name}
                    >
                      <div className="destination-image">
                        <img src={place.image} alt={place.name} />
                        <span className="destination-tag">
                          {place.tag}
                        </span>
                        <button
                          className="save-button"
                          aria-label={`Remove ${place.name} from saved places`}
                          onClick={() => toggleSavedPlace(place.name)}
                        >
                          ♥
                        </button>
                      </div>

                      <div className="destination-info">
                        <div>
                          <h3>{place.name}</h3>
                          <p>{place.country}</p>
                        </div>
                      </div>

                      <button
                        className="destination-link"
                        onClick={() => chooseDestination(place.name)}
                      >
                        Plan this trip <span>↗</span>
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-illustration">♡</div>
                  <h2>No saved places yet</h2>
                  <p>
                    Visit your Dashboard and tap the heart on a destination
                    to add it to your wishlist.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => setActivePage('Dashboard')}
                  >
                    Explore destinations →
                  </button>
                </div>
              )}
            </section>
          )}

          <footer className="page-footer">
            <span>✈️ TravelMate</span>
            <span>Made for the journeys that matter.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App