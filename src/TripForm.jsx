import { useState, useEffect } from 'react';

export default function TripForm({
  onSubmit = (data) => { console.log('Trip data:', data); },
  editingTrip,
  onLogout,
  user
}) {
  const [form, setForm] = useState({
    start: '',
    destination: '',
    date: '',
    returnDate: '',
    note: '',
    transport: '',
    activities: [''],
    links: [''],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTrip) {
      let activities = editingTrip.activities;
      if (typeof activities === 'string') {
        try {
          activities = JSON.parse(activities);
        } catch {
          activities = [''];
        }
      }
      if (!Array.isArray(activities)) activities = [''];

      let links = editingTrip.links;
      if (typeof links === 'string') {
        try {
          links = JSON.parse(links);
        } catch {
          links = [''];
        }
      }
      if (!Array.isArray(links)) links = [''];

      setForm({
        ...editingTrip,
        date: editingTrip.date ? editingTrip.date.split('T')[0] : '',
        returnDate: editingTrip.returnDate ? editingTrip.returnDate.split('T')[0] : '',
        activities,
        links,
      });
      setErrors({});
    }
  }, [editingTrip]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.start.trim()) newErrors.start = 'Zadejte místo startu';
    if (!form.destination.trim()) newErrors.destination = 'Zadejte cíl cesty';
    if (!form.date) newErrors.date = 'Zadejte datum cesty';
    if (!form.returnDate) {
      newErrors.returnDate = 'Zadejte datum cesty zpět';
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const retDate = new Date(form.returnDate);
      if (retDate < today) {
        newErrors.returnDate = 'Datum cesty zpět nemůže být v minulosti';
      }
    }
    if (!form.transport) newErrors.transport = 'Vyberte typ dopravy';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('activity')) {
      const idx = parseInt(name.split('-')[1], 10);
      setForm((prev) => {
        const newActivities = [...prev.activities];
        newActivities[idx] = value;
        return { ...prev, activities: newActivities };
      });
      setErrors((prev) => ({ ...prev, [`activity-${idx}`]: '' }));
    } else if (name.startsWith('link')) {
      const idx = parseInt(name.split('-')[1], 10);
      setForm((prev) => {
        const newLinks = [...prev.links];
        newLinks[idx] = value;
        return { ...prev, links: newLinks };
      });
      setErrors((prev) => ({ ...prev, [`link-${idx}`]: '' }));
  // odstraněna logika pro URL obrázků
  // odstraněna logika pro nahrávání obrázků
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      setForm({
        start: '',
        destination: '',
        date: '',
        returnDate: '',
        note: '',
        transport: '',
        activities: [''],
        links: [''],
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Chyba při ukládání cesty' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={topBarStyle}>
        <span style={userStyle}>{user?.email}</span>
      </div>
      <h2 style={titleStyle}>{editingTrip ? 'Upravit cestu' : 'Přidat novou cestu'}</h2>
      {errors.submit && <div style={errorStyle}>{errors.submit}</div>}

      {/* Start */}
      <div style={fieldStyle}>
        <input name="start" placeholder="Start" value={form.start} onChange={handleChange} style={errors.start ? { ...inputStyle, ...errorInputStyle } : inputStyle} aria-invalid={!!errors.start} aria-describedby={errors.start ? 'start-error' : undefined} />
        {errors.start && <span style={errorTextStyle} id="start-error">{errors.start}</span>}
      </div>

      {/* Cíl */}
      <div style={fieldStyle}>
        <input name="destination" placeholder="Cíl" value={form.destination} onChange={handleChange} style={errors.destination ? { ...inputStyle, ...errorInputStyle } : inputStyle} aria-invalid={!!errors.destination} aria-describedby={errors.destination ? 'destination-error' : undefined} />
        {errors.destination && <span style={errorTextStyle} id="destination-error">{errors.destination}</span>}
      </div>

      {/* Termín tam */}
      <div style={fieldStyle}>
        <input name="date" type="date" value={form.date} onChange={handleChange} style={errors.date ? { ...inputStyle, ...errorInputStyle } : inputStyle} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-error' : undefined} />
        {errors.date && <span style={errorTextStyle} id="date-error">{errors.date}</span>}
      </div>

      {/* Termín zpět */}
      <div style={fieldStyle}>
        <input name="returnDate" type="date" value={form.returnDate} onChange={handleChange} min={form.date ? form.date : new Date().toISOString().split('T')[0]} style={errors.returnDate ? { ...inputStyle, ...errorInputStyle } : inputStyle} aria-invalid={!!errors.returnDate} aria-describedby={errors.returnDate ? 'returnDate-error' : undefined} />
        {errors.returnDate && <span style={errorTextStyle} id="returnDate-error">{errors.returnDate}</span>}
      </div>

      {/* Aktivity */}
      <div style={fieldStyle}>
        <label>Aktivity:</label>
        {form.activities.map((activity, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input name={`activity-${idx}`} placeholder={`Aktivita ${idx + 1}`} value={activity} onChange={handleChange} style={inputStyle} />
            <button type="button" style={{ ...submitButtonStyle, padding: '0.3rem 0.7rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setForm((prev) => ({ ...prev, activities: prev.activities.filter((_, i) => i !== idx) })); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" fill="#e74c3c" />
                <path d="M9 10v6M12 10v6M15 10v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" style={{ ...submitButtonStyle, backgroundColor: '#07689f', marginTop: '0.5rem' }} onClick={() => { setForm((prev) => ({ ...prev, activities: [...prev.activities, ''] })); }}>Přidat aktivitu</button>
      </div>

      {/* Odkazy Booking, Mapy.cz */}
      <div style={fieldStyle}>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
          <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(form.destination)}`} target="_blank" rel="noopener noreferrer" title="Booking.com">
            <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="32" rx="8" fill="#003580"/>
              <text x="50" y="21" textAnchor="middle" fontSize="18" fill="white" fontFamily="Arial" fontWeight="bold">Booking</text>
            </svg>
          </a>
          <a href={`https://mapy.cz/zakladni?query=${encodeURIComponent(form.destination)}`} target="_blank" rel="noopener noreferrer" title="Mapy.cz">
            <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="32" rx="8" fill="#4CAF50"/>
              <text x="50" y="21" textAnchor="middle" fontSize="18" fill="white" fontFamily="Arial" fontWeight="bold">Mapy.cz</text>
            </svg>
          </a>
        </div>
      </div>

  {/* Možnost vložení vlastního odkazu */}
      <div style={fieldStyle}>
        <label>Odkazy:</label>
        {form.links.map((link, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              name={`link-${idx}`}
              placeholder={`Odkaz ${idx + 1} (např. Google Docs, itinerář)`}
              value={link}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="button" style={{ ...submitButtonStyle, padding: '0.3rem 0.7rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {
              setForm((prev) => ({
                ...prev,
                links: prev.links.filter((_, i) => i !== idx)
              }));
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" fill="#e74c3c" />
                <path d="M9 10v6M12 10v6M15 10v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" style={{ ...submitButtonStyle, backgroundColor: '#07689f', marginTop: '0.5rem' }} onClick={() => {
          setForm((prev) => ({ ...prev, links: [...prev.links, ''] }));
        }}>Přidat odkaz</button>
      </div>

      {/* Poznámka */}
      <div style={fieldStyle}>
        <input name="note" placeholder="Poznámka (volitelné)" value={form.note} onChange={handleChange} style={inputStyle} />
      </div>

      {/* Výběr transportu */}
      <div style={fieldStyle}>
        <select name="transport" value={form.transport} onChange={handleChange} style={errors.transport ? { ...inputStyle, ...errorInputStyle } : inputStyle} aria-invalid={!!errors.transport} aria-describedby={errors.transport ? 'transport-error' : undefined}>
          <option value="">Vyberte typ dopravy</option>
          <option value="Auto">Auto</option>
          <option value="Vlak">Vlak</option>
          <option value="Letadlo">Letadlo</option>
        </select>
        {errors.transport && <span style={errorTextStyle} id="transport-error">{errors.transport}</span>}
      </div>

      <button type="submit" style={isSubmitting ? { ...submitButtonStyle, ...disabledButtonStyle } : submitButtonStyle} disabled={isSubmitting}>
        {isSubmitting ? 'Ukládání...' : editingTrip ? 'Uložit změny' : 'Přidat cestu'}
      </button>
    </form>
  );
}

// 🎨 Styly
const formStyle = {
  position: 'fixed',
  top: 115, // výška headeru v px
  left: 24, // více doleva, odsazení od levého okraje
  right: 'auto', // zarovnání vlevo, ne na střed
  zIndex: 999,
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  maxWidth: '800px', // širší formulář
  width: '600px',    // pevná šířka pro větší šířku
  maxHeight: '95vh', // větší maximální výška okna
  overflow: 'auto',  // scrollování při větším obsahu
  margin: 0, // žádné centrování
  display: 'grid',
  gap: '1rem',
  fontFamily: 'Arial, sans-serif',};

const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const userStyle = {
  color: '#07689f',
  fontWeight: 'bold',
  fontSize: '1rem',
};

const titleStyle = {
  textAlign: 'center',
  color: '#07689f',
  marginBottom: '1rem',
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  transition: 'border-color 0.3s ease',
};

const errorInputStyle = {
  borderColor: '#e74c3c',
  backgroundColor: '#fff5f5',
};

const errorTextStyle = {
  color: '#e74c3c',
  fontSize: '0.875rem',
  marginTop: '0.25rem',
};

const errorStyle = {
  color: '#e74c3c',
  textAlign: 'center',
  fontSize: '0.875rem',
  marginBottom: '1rem',
};

const submitButtonStyle = {
  backgroundColor: '#40a798',
  color: 'white',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.1s ease',
  ':hover': {
    backgroundColor: '#359184',
    transform: 'translateY(-1px)',
  },
};

const disabledButtonStyle = {
  backgroundColor: '#a0a0a0',
  cursor: 'not-allowed',
  transform: 'none',
};

const logoutButtonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginLeft: '1rem',
  transition: 'background-color 0.3s ease, transform 0.1s ease',
  ':hover': {
    backgroundColor: '#c0392b',
    transform: 'translateY(-1px)',
  },
};