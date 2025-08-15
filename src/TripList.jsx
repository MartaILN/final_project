import { useState } from 'react';
export default function TripList({
  trips = [],
  onEdit = () => {},
  onDelete = () => {},
  onToggleDone = () => {},
}) {
  const [showEmailInputId, setShowEmailInputId] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterDone, setFilterDone] = useState('all');
  const [filterTransport, setFilterTransport] = useState('all');
  const [searchDestination, setSearchDestination] = useState('');
  if (!trips.length) {
    return (
      <div style={{ paddingTop: 8 }}>
        <p style={{ textAlign: 'center', color: '#888' }}>Žádné cesty nejsou k dispozici.</p>
      </div>
    );
  }

  // Filtering logic
  let filteredTrips = trips;
  if (filterDone !== 'all') {
    filteredTrips = filteredTrips.filter(trip => filterDone === 'done' ? trip.done : !trip.done);
  }
  if (filterTransport !== 'all') {
    filteredTrips = filteredTrips.filter(trip => trip.transport === filterTransport);
  }
  if (searchDestination.trim() !== '') {
    filteredTrips = filteredTrips.filter(trip => trip.destination && trip.destination.toLowerCase().includes(searchDestination.toLowerCase()));
  }

    // Sorting logic
    const sortedTrips = [...filteredTrips].sort((a, b) => {
      let valA, valB;
      // Pokud je filtr 'vše' a sortBy je 'date', řaď pouze podle datumu
      if (filterDone === 'all' && sortBy === 'date') {
        valA = a.date;
        valB = b.date;
      } else {
        switch (sortBy) {
          case 'date':
            valA = a.date;
            valB = b.date;
            break;
          case 'done':
            valA = a.done ? 1 : 0;
            valB = b.done ? 1 : 0;
            break;
          case 'price':
            valA = Object.values(a.budget || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
            valB = Object.values(b.budget || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
            break;
          case 'transport':
            valA = a.transport || '';
            valB = b.transport || '';
            break;
          case 'destination':
            valA = a.destination || '';
            valB = b.destination || '';
            break;
          default:
            valA = a.date;
            valB = b.date;
        }
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="pt-0">
  <div className="w-full mb-8 p-5 border rounded-lg shadow flex flex-wrap gap-5 items-center bg-white justify-around sticky" style={{boxSizing: 'border-box', height: '40px', width: '96%', marginLeft: 'auto', top: '30px', zIndex: 10}}>
        <label className="font-bold">Stav:
          <select value={filterDone} onChange={e => setFilterDone(e.target.value)} className="ml-2 p-2 rounded border">
            <option value="all">Vše</option>
            <option value="done">Dokončené</option>
            <option value="notdone">Nedokončené</option>
          </select>
        </label>
        <label className="font-bold">Vyhledat destinaci:
          <input
            type="text"
            value={searchDestination}
            onChange={e => setSearchDestination(e.target.value)}
            className="ml-2 p-2 rounded border"
            placeholder="Zadejte destinaci..."
          />
        </label>
        <label className="font-bold">Řadit podle:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="ml-2 p-2 rounded border">
            <option value="date">Datum</option>
            <option value="price">Cena</option>
          </select>
        </label>
        <label className="font-bold">Typ dopravy:
          <select value={filterTransport} onChange={e => setFilterTransport(e.target.value)} className="ml-2 p-2 rounded border">
            <option value="all">Vše</option>
            <option value="Auto">Auto</option>
            <option value="MHD">MHD</option>
            <option value="Letadlo">Letadlo</option>
          </select>
        </label>
        <label className="font-bold">Směr:
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="ml-2 p-2 rounded border">
            <option value="asc">Vzestupně</option>
            <option value="desc">Sestupně</option>
          </select>
        </label>
      </div>
      <ul className="list-none p-0">
        {sortedTrips.map((trip) => (
          <li
            key={trip.id}
            className={`mb-[20px] rounded-[4px] shadow-lg transition-colors p-8 ${trip.done ? 'bg-[#e6ffe6]' : 'bg-[#fdf6e3]'} border border-[#e6dcc2] mb-[20px]`}
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
                <div className="bg-[#fdf6e3] rounded-xl p-4 shadow-sm pl-[20px] pt-5 mt-[20px]">
                  <div className="font-bold text-[#40a798] mb-2 flex items-center gap-2">Rozpočet:</div>
                  <table className="w-1/2 border-collapse text-base pl-[75px] mt-[10px]">
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
                    <div className="mb-1 pl-[20px] mt-[20px]">
                      <span className="font-bold">Aktivity:</span>
                      <ul className="ml-5 list-disc mt-[10px]">
                        {filteredActivities.map((a, i) => (
                          <li key={i} className="mb-1">
                            <span>{a}</span>
                            {filteredLinks[i] && (
                              <a href={filteredLinks[i]} target="_blank" rel="noopener noreferrer" className="text-[#07689f] ml-[20px] underline">[odkaz]</a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {filteredLinks.length > filteredActivities.length && (
                    <div className="mb-1 pl-[20px]">
                      <span className="font-bold">Další odkazy:</span>
                      <ul className="ml-5 list-disc mt-[20px]">
                        {filteredLinks.slice(filteredActivities.length).map((l, i) => (
                          <li key={i} className="mb-1">
                            <a href={l} target="_blank" rel="noopener noreferrer" className="text-[#07689f] underline">{l}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {trip.note && (
                    <div className="mt-[20px] break-words whitespace-pre-line pl-[20px]">
                      <span className="font-bold">Poznámka:</span> {trip.note}
                    </div>
                  )}
                  <div className="flex gap-2 mt-[20px] mb-[20px]">
                    <button
                      onClick={() => onEdit(trip)}
                      className="bg-[#07689f] text-[#f5ecd7] rounded-[4px] p-[5px] font-bold hover:bg-[#359184] transition-colors ml-[50px] border-0"
                    >Upravit</button>
                    {trip.public === true && (
                      <>
                        <button
                          onClick={() => setShowEmailInputId(trip.id)}
                          className="bg-[#40a798] text-[#f5ecd7] rounded-[4px] p-[5px] font-bold hover:bg-[#359184] transition-colors ml-[50px] border-0"
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