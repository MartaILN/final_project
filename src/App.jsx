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
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} user={user} onSignOut={handleSignOut} />
      <div className="flex-1">
        <Routes>
          <Route path="/sign-in" element={
            <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#a2d5c6] to-[#07689f]">
              <Auth />
            </div>
          } />
          <Route
            path="/trips"
            element={
              <div className="flex flex-col items-center justify-center py-8">
                <TripList
                  trips={trips}
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
                <div className="flex justify-center items-start gap-8 mx-auto my-8 max-w-[1100px]">
                  <div className="flex-shrink-0 min-w-[320px] w-[400px] bg-white rounded-xl shadow-lg p-6">
                    <TripForm
                      user={user}
                      onSubmit={handleAddTrip}
                      editingTrip={editingTrip}
                      onLogout={handleSignOut}
                    />
                  </div>
                  <div className="flex-1 bg-white rounded-xl shadow-lg p-6 max-h-[calc(100vh-96px)] overflow-y-auto mt-12">
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