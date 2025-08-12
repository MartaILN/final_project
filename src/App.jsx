import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import {Header} from './components/Header/Header';
import {Footer} from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Header/Auth';
import TripForm from './TripForm';
import TripList from './TripList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null); // přidáno pro úpravy
  const navigate = useNavigate();

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
    const { data, error: selectError } = await supabase.from('trips').select('*');
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
    const { data } = await supabase.from('trips').select('*');
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
    const { data } = await supabase.from('trips').select('*');
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header isAuthenticated={isAuthenticated} user={user} onSignOut={handleSignOut} />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/sign-in" element={<Auth />} />
          <Route
            path="/trips"
            element={
              <TripList
                trips={trips}
                onEdit={handleEditTrip}
                onDelete={handleDeleteTrip}
                onToggleDone={handleToggleDone}
              />
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '2rem',
                    margin: '2rem auto',
                    maxWidth: 1100,
                  }}
                >
                  <div style={{
                    flex: '0 0 400px',
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    padding: '1.5rem',
                    minWidth: 320,
                  }}>
                    <TripForm
                      user={user}
                      onSubmit={handleAddTrip}
                      editingTrip={editingTrip}
                      onLogout={handleSignOut}
                    />
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    padding: '1.5rem',
                    maxHeight: 'calc(100vh - 96px)', // 48px header + 2*24px margin (nebo uprav dle potřeby)
                    overflowY: 'auto',
                    marginTop: 48, // přidáno odsazení pod header
                  }}>
                    <TripList
                      trips={trips}
                      onEdit={handleEditTrip}
                      onDelete={handleDeleteTrip}
                      onToggleDone={handleToggleDone}
                    />
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