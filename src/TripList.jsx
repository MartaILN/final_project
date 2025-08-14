import { useState } from 'react';
export default function TripList({
  trips = [],
  onEdit = () => {},
  onDelete = () => {},
  onToggleDone = () => {},
}) {
  const [showEmailInputId, setShowEmailInputId] = useState(null);
  const [emailInput, setEmailInput] = useState('');
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
                {trip.date} – {trip.returnDate}<br />
                {trip.start} → {trip.destination} ({trip.transport})
                  {trip.budget && typeof trip.budget === 'object' && (
                    <>
                      <br />
                      <strong>Rozpočet:</strong>
                      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.5rem 0' }}>
                        <thead>
                          <tr style={{ background: '#f5f5f5' }}>
                            <th style={{ textAlign: 'left', padding: '0.3rem', border: '1px solid #ccc' }}>Kategorie</th>
                            <th style={{ textAlign: 'left', padding: '0.3rem', border: '1px solid #ccc' }}>Částka (Kč)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(trip.budget).map(([key, value]) => (
                            value ? (
                              <tr key={key}>
                                <td style={{ padding: '0.3rem', border: '1px solid #ccc' }}>{
                                  key === 'accommodation' ? 'Ubytování' :
                                  key === 'transport' ? 'Doprava' :
                                  key === 'food' ? 'Jídlo' :
                                  key === 'activities' ? 'Aktivity' :
                                  key === 'other' ? 'Ostatní' : key
                                }</td>
                                <td style={{ padding: '0.3rem', border: '1px solid #ccc' }}>{value} Kč</td>
                              </tr>
                            ) : null
                          ))}
                          {/* Celkem */}
                          <tr style={{ background: '#eaf6ea', fontWeight: 'bold' }}>
                            <td style={{ padding: '0.3rem', border: '1px solid #ccc' }}>Celkem</td>
                            <td style={{ padding: '0.3rem', border: '1px solid #ccc' }}>
                              {Object.values(trip.budget).reduce((sum, val) => sum + (Number(val) || 0), 0)} Kč
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
              </span>
            </label>
            {(() => {
              let activities = [];
              if (Array.isArray(trip.activities)) {
                activities = trip.activities;
              } else if (typeof trip.activities === 'string' && trip.activities) {
                try { activities = JSON.parse(trip.activities); } catch {}
              }
              return activities.length > 0 ? (
                <div style={{ margin: '0.5rem 0' }}>
                  <strong>Aktivity:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {activities.map((a, i) => a && <li key={i}>{a}</li>)}
                  </ul>
                </div>
              ) : null;
            })()}
            {(() => {
              let links = [];
              if (Array.isArray(trip.links)) {
                links = trip.links;
              } else if (typeof trip.links === 'string' && trip.links) {
                try { links = JSON.parse(trip.links); } catch {}
              }
              return links.length > 0 ? (
                <div style={{ margin: '0.5rem 0' }}>
                  <strong>Odkazy:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {links.map((l, i) => l && <li key={i}><a href={l} target="_blank" rel="noopener noreferrer">{l}</a></li>)}
                  </ul>
                </div>
              ) : null;
            })()}
            {trip.note && (
              <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
                <strong>Poznámka:</strong> {trip.note}
              </div>
            )}
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
                marginRight: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Smazat
            </button>
            {trip.public === true && (
              <>
                <button
                  onClick={() => setShowEmailInputId(trip.id)}
                  style={{ background: '#40a798', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: 'bold', marginRight: '0.5rem' }}
                >
                  Sdílet e-mailem
                </button>
                {showEmailInputId === trip.id && (
                  <div style={{ margin: '0.5rem 0' }}>
                    <input
                      type="email"
                      placeholder="Zadejte e-mailovou adresu"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: 6, border: '1px solid #ccc', marginRight: '0.5rem' }}
                    />
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/trip/${trip.id}`;
                        const subject = encodeURIComponent('Sdílení cesty');
                        const body = encodeURIComponent(`Podívej se na tuto cestu: ${url}`);
                        window.location.href = `mailto:${emailInput}?subject=${subject}&body=${body}`;
                        setShowEmailInputId(null);
                        setEmailInput('');
                      }}
                      style={{ background: '#40a798', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}
                      disabled={!emailInput}
                    >Odeslat</button>
                    <button
                      onClick={() => { setShowEmailInputId(null); setEmailInput(''); }}
                      style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: 'bold', marginLeft: '0.5rem' }}
                    >Zrušit</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}