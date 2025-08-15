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

  // Zachovat původní pořadí cest
  const sortedTrips = trips;

  return (
    <div className="pt-0">
      <ul className="list-none p-0">
        {sortedTrips.map((trip) => (
          <li
            key={trip.id}
            className={`mb-[20px] rounded-[4px] shadow-lg transition-colors p-8 ${trip.done ? 'bg-[#e6ffe6]' : 'bg-[#fdf6e3]'} border border-[#e6dcc2]`}
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-[20px] mb-2 p-[20px] bg-[#e3f2fd] rounded-[4px] relative">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-5 w-full">
                    <div className="flex items-center w-full gap-5">
                      <input
                        type="checkbox"
                        checked={!!trip.done}
                        onChange={() => onToggleDone(trip.id, !trip.done)}
                        className="w-8 h-8 accent-[#40a798] flex-shrink-0 align-middle"
                      />
                      <div className="flex-1">
                        <div className="text-3xl font-extrabold text-[#07689f] mb-1 ml-[20px]">{trip.date} – {trip.returnDate}</div>
                        <div className="text-lg text-[#07689f] ml-[20px]">{trip.start} <span className="mx-2">→</span> {trip.destination} <span className="italic">({trip.transport})</span></div>
                      </div>
                      <button
                        onClick={() => onDelete(trip.id)}
                        className="bg-[#fa8072] text-white px-3 py-1 rounded-[4px] text-sm flex items-center justify-center h-[30px] border-0 hover:bg-[#c0392b] transition-colors"
                        aria-label="Smazat cestu"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="4" y1="4" x2="14" y2="14" stroke="#fdf6e3" strokeWidth="2" strokeLinecap="round" />
                          <line x1="14" y1="4" x2="4" y2="14" stroke="#fdf6e3" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {trip.budget && typeof trip.budget === 'object' && (
                <div className="bg-[#fdf6e3] rounded-xl p-4 shadow-sm pl-[20px] pt-5">
                  <div className="font-bold text-[#40a798] mb-2 flex items-center gap-2">Rozpočet:</div>
                  <table className="w-1/2 border-collapse text-base pl-[75px]">
                    <thead>
                      <tr className="bg-[#f5f5f5]">
                        <th className="text-left p-2 border border-[#ccc]">Kategorie</th>
                        <th className="text-left p-2 border border-[#ccc]">Částka (Kč)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(trip.budget).map(([key, value]) => (
                        value ? (
                          <tr key={key}>
                            <td className="p-2 border border-[#ccc]">{
                              key === 'accommodation' ? 'Ubytování' :
                              key === 'transport' ? 'Doprava' :
                              key === 'food' ? 'Jídlo' :
                              key === 'activities' ? 'Aktivity' :
                              key === 'other' ? 'Ostatní' : key
                            }</td>
                            <td className="p-2 border border-[#ccc]">{value} Kč</td>
                          </tr>
                        ) : null
                      ))}
                      {/* Celkem */}
                      <tr className="bg-[#eaf6ea] font-bold">
                        <td className="p-2 border border-[#ccc]">Celkem</td>
                        <td className="p-2 border border-[#ccc]">
                          {Object.values(trip.budget).reduce((sum, val) => sum + (Number(val) || 0), 0)} Kč
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            {(() => {
              let activities = [];
              let links = [];
              if (Array.isArray(trip.activities)) {
                activities = trip.activities;
              } else if (typeof trip.activities === 'string' && trip.activities) {
                try { activities = JSON.parse(trip.activities); } catch {}
              }
              if (Array.isArray(trip.links)) {
                links = trip.links;
              } else if (typeof trip.links === 'string' && trip.links) {
                try { links = JSON.parse(trip.links); } catch {}
              }
              const filteredActivities = activities.filter(a => a && a.trim() !== '');
              const filteredLinks = links.filter(l => l && l.trim() !== '');
              return (
                <div className="px-6 pb-2">
                  {filteredActivities.length > 0 && (
                    <div className="mb-1 pl-[20px] mt-5">
                      <span className="font-bold">Aktivity:</span>
                      <ul className="ml-5 list-disc">
                        {filteredActivities.map((a, i) => (
                          <li key={i} className="mb-1">
                            <span>{a}</span>
                            {filteredLinks[i] && (
                              <a href={filteredLinks[i]} target="_blank" rel="noopener noreferrer" className="text-[#07689f] ml-2 underline">[odkaz]</a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {filteredLinks.length > filteredActivities.length && (
                    <div className="mb-1 pl-[20px]">
                      <span className="font-bold">Další odkazy:</span>
                      <ul className="ml-5 list-disc">
                        {filteredLinks.slice(filteredActivities.length).map((l, i) => (
                          <li key={i} className="mb-1">
                            <a href={l} target="_blank" rel="noopener noreferrer" className="text-[#07689f] underline">{l}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {trip.note && (
                    <div className="mt-2 break-words whitespace-pre-line pl-[20px]">
                      <span className="font-bold">Poznámka:</span> {trip.note}
                    </div>
                  )}
                  <div className="flex gap-2 mt-3 mb-2">
                    <button
                      onClick={() => onEdit(trip)}
                      className="bg-[#07689f] text-white rounded-md px-5 py-1 font-bold hover:bg-[#359184] transition-colors"
                    >Upravit</button>
                    {trip.public === true && (
                      <>
                        <button
                          onClick={() => setShowEmailInputId(trip.id)}
                          className="bg-[#40a798] text-white rounded-md px-5 py-1 font-bold hover:bg-[#359184] transition-colors"
                        >Sdílet e-mailem</button>
                        {showEmailInputId === trip.id && (
                          <div className="mt-2 flex flex-col gap-2">
                            <input
                              type="email"
                              placeholder="Zadejte e-mailovou adresu"
                              value={emailInput}
                              onChange={e => setEmailInput(e.target.value)}
                              className="p-2 rounded-md border border-[#ccc] mr-2 w-[250px]"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}/trip/${trip.id}`;
                                  const subject = encodeURIComponent('Sdílení cesty');
                                  const body = encodeURIComponent(`Podívej se na tuto cestu: ${url}`);
                                  window.location.href = `mailto:${emailInput}?subject=${subject}&body=${body}`;
                                  setShowEmailInputId(null);
                                  setEmailInput('');
                                }}
                                className="bg-[#40a798] text-white rounded-md px-4 py-1 font-bold hover:bg-[#359184] transition-colors"
                                disabled={!emailInput}
                              >Odeslat</button>
                              <button
                                onClick={() => { setShowEmailInputId(null); setEmailInput(''); }}
                                className="bg-[#e74c3c] text-white rounded-md px-4 py-1 font-bold hover:bg-[#c0392b] transition-colors"
                              >Zrušit</button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}