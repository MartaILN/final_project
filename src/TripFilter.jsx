import React from 'react';

export default function TripFilter({
  filterDone, setFilterDone,
  filterTransport, setFilterTransport,
  sortBy, setSortBy,
  sortOrder, setSortOrder,
  searchDestination, setSearchDestination
}) {
  return (
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
  );
}
