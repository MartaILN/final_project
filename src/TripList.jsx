export default function TripList({
  trips = [],
  onEdit = () => {},
  onDelete = () => {},
  onToggleDone = () => {},
}) {
  if (!trips.length) {
    return (
      <div style={{ paddingTop: 8 }}>
        <p style={{ textAlign: 'center', color: '#888' }}>Žádné cesty nejsou k dispozici.</p>
      </div>
    );
  }

  // Seřadit podle datumu vzestupně (nejbližší nahoře)
  const sortedTrips = [...trips].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ paddingTop: 0 }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sortedTrips.map((trip) => (
          <li
            key={trip.id}
            style={{
              marginBottom: '1rem',
              borderBottom: '1px solid #ccc',
              background: trip.done ? '#e6ffe6' : 'white',
              opacity: 1,
              transition: 'background 0.2s',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!trip.done}
                onChange={() => onToggleDone(trip.id, !trip.done)}
                style={{
                  marginRight: 8,
                  accentColor: trip.done ? '#40a798' : undefined,
                  width: 20,
                  height: 20,
                }}
              />
              <span>
                {trip.date}: {trip.start} → {trip.destination} ({trip.transport})
              </span>
            </label>
            <small>{trip.note}</small>
            <br />
            <button
              onClick={() => onEdit(trip)}
              style={{
                background: '#07689f',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '0.4rem 1rem',
                marginRight: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Upravit
            </button>
            <button
              onClick={() => onDelete(trip.id)}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}