import React from 'react';

export default function TripFilter({
  filterDone, setFilterDone,
  filterTransport, setFilterTransport,
  sortBy, setSortBy,
  sortOrder, setSortOrder,
  searchDestination, setSearchDestination
}) {
  return (
    <div
      className="w-full mb-8 flex flex-wrap gap-6 items-center justify-around"
      style={{
        background: 'linear-gradient(90deg, #e0f7fa 0%, #fce4ec 100%)',
        borderRadius: '18px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  padding: '12px 8px',
        marginBottom: '32px',
        border: '1px solid #b2ebf2',
        minHeight: '60px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
  <label className="font-bold text-[#07689f] text-lg flex items-center gap-[10px]">Stav:
        <select value={filterDone} onChange={e => setFilterDone(e.target.value)} className="ml-2 p-2 rounded-lg border border-[#b2ebf2] bg-white focus:outline-none">
          <option value="all">Vše</option>
          <option value="done">Dokončené</option>
          <option value="notdone">Nedokončené</option>
        </select>
      </label>
  <label className="font-bold text-[#07689f] text-lg flex items-center gap-[10px]">Vyhledat destinaci:
        <input
          type="text"
          value={searchDestination}
          onChange={e => setSearchDestination(e.target.value)}
          className="ml-2 p-2 rounded-lg border border-[#b2ebf2] bg-white focus:outline-none"
          placeholder="Zadejte destinaci..."
        />
      </label>
  <label className="font-bold text-[#07689f] text-lg flex items-center gap-[10px]">Řadit podle:
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="ml-2 p-2 rounded-lg border border-[#b2ebf2] bg-white focus:outline-none">
          <option value="date">Datum</option>
          <option value="price">Cena</option>
        </select>
      </label>
  <label className="font-bold text-[#07689f] text-lg flex items-center gap-[10px]">Typ dopravy:
        <select value={filterTransport} onChange={e => setFilterTransport(e.target.value)} className="ml-2 p-2 rounded-lg border border-[#b2ebf2] bg-white focus:outline-none">
          <option value="all">Vše</option>
          <option value="Auto">Auto</option>
          <option value="MHD">MHD</option>
          <option value="Letadlo">Letadlo</option>
        </select>
      </label>
  <label className="font-bold text-[#07689f] text-lg flex items-center gap-[10px]">Směr:
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="ml-2 p-2 rounded-lg border border-[#b2ebf2] bg-white focus:outline-none">
          <option value="asc">Vzestupně</option>
          <option value="desc">Sestupně</option>
        </select>
      </label>
    </div>
  );
}
