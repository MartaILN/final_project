import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import {Header} from './components/Header/Header';
import {Footer} from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Header/Auth';
import TripForm from './TripForm';
import TripList from './TripList';
import TripFilter from './TripFilter';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null); // přidáno pro úpravy
  const navigate = useNavigate();

  // Stavové proměnné pro TripFilter
  const [filterDone, setFilterDone] = useState('all');
  const [filterTransport, setFilterTransport] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchDestination, setSearchDestination] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      supabase
        .from('trips')
        .select('*')
        .order('id', { ascending: true })
        .then(({ data }) => setTrips(data || []));
    } else {
      setTrips([]);
    }
  }, [isAuthenticated]);

  // Přidání nové cesty nebo úprava existující
  const handleAddTrip = async (tripData) => {
    if (editingTrip) {
      // Úprava cesty
      const { error } = await supabase
        .from('trips')
        .update({ ...tripData })
        .eq('id', editingTrip.id);
      if (error) {
        alert('Chyba při ukládání: ' + error.message);
        return;
      }
      setEditingTrip(null);
    } else {
      // Nová cesta
      const tripWithUser = {
        ...tripData,
        user_id: user.id,
        done: false,
      };
      const { error } = await supabase.from('trips').insert([tripWithUser]);
      if (error) {
        alert('Chyba při ukládání: ' + error.message);
        return;
      }
    }
  const { data, error: selectError } = await supabase.from('trips').select('*').order('id', { ascending: true });
    if (selectError) {
      alert('Chyba při načítání: ' + selectError.message);
      return;
    }
    setTrips(data || []);
  };

  // Označení cesty jako hotové/nehotové
  const handleToggleDone = async (id, done) => {
    const { error } = await supabase.from('trips').update({ done }).eq('id', id);
    if (error) {
      alert('Chyba při změně stavu: ' + error.message);
      return;
    }
  const { data } = await supabase.from('trips').select('*').order('id', { ascending: true });
  setTrips(data || []);
  };

  // Smazání cesty
  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Opravdu chcete tuto cestu smazat?')) return;
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (error) {
      alert('Chyba při mazání: ' + error.message);
      return;
    }
  const { data } = await supabase.from('trips').select('*').order('id', { ascending: true });
  setTrips(data || []);
  };

  // Zahájení úpravy cesty
  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Filtrování a řazení trips podle hodnot z TripFilter
  const getFilteredSortedTrips = () => {
    let filtered = [...trips];
    if (filterDone !== 'all') {
      filtered = filtered.filter(trip => filterDone === 'done' ? trip.done : !trip.done);
    }
    if (filterTransport !== 'all') {
      filtered = filtered.filter(trip => trip.transport === filterTransport);
    }
    if (searchDestination.trim() !== '') {
      filtered = filtered.filter(trip => trip.destination && trip.destination.toLowerCase().includes(searchDestination.toLowerCase()));
    }
    filtered.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'date':
          valA = a.date;
          valB = b.date;
          break;
        case 'price':
          valA = Object.values(a.budget || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
          valB = Object.values(b.budget || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
          break;
        default:
          valA = a.date;
          valB = b.date;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  };

  return (
    <div
      className="min-h-screen flex flex-col"
    >
      <Header isAuthenticated={isAuthenticated} user={user} onSignOut={handleSignOut} />
      <div className="flex-1">
        <Routes>
          <Route path="/sign-in" element={
            <div className="min-h-[80vh] flex items-center justify-center">
              <Auth />
            </div>
          } />
          <Route
            path="/trips"
            element={
              <div className="flex flex-col items-center justify-center py-8">
                <TripList
                  trips={getFilteredSortedTrips()}
                  onEdit={handleEditTrip}
                  onDelete={handleDeleteTrip}
                  onToggleDone={handleToggleDone}
                />
              </div>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div style={{ margin: '32px auto', maxWidth: '1600px', display: 'flex', gap: '48px', marginTop: '74px', width: '100%' }}>
                  <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <TripForm
                      user={user}
                      onSubmit={handleAddTrip}
                      editingTrip={editingTrip}
                      onLogout={handleSignOut}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ marginTop: '35px', marginBottom: '-36px' }}>
                      <TripFilter
                        filterDone={filterDone}
                        setFilterDone={setFilterDone}
                        filterTransport={filterTransport}
                        setFilterTransport={setFilterTransport}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        searchDestination={searchDestination}
                        setSearchDestination={setSearchDestination}
                      />
                    </div>
                    <div className="w-full bg-white rounded-xl shadow-lg p-6" style={{ height: '90vh', marginTop: '0', overflowY: 'auto' }}>
                      <TripList
                        trips={getFilteredSortedTrips()}
                        onEdit={handleEditTrip}
                        onDelete={handleDeleteTrip}
                        onToggleDone={handleToggleDone}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;