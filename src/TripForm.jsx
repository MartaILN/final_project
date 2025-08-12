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
    note: '',
    transport: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTrip) {
      setForm({
        ...editingTrip,
        date: editingTrip.date ? editingTrip.date.split('T')[0] : '',
      });
      setErrors({});
    }
  }, [editingTrip]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.start.trim()) newErrors.start = 'Zadejte místo startu';
    if (!form.destination.trim()) newErrors.destination = 'Zadejte cíl cesty';
    if (!form.date) newErrors.date = 'Zadejte datum cesty';
    if (!form.transport) newErrors.transport = 'Vyberte typ dopravy';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
        note: '',
        transport: '',
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
        <span style={userStyle}>
          {user?.email}
        </span>
        
      </div>
      <h2 style={titleStyle}>
        {editingTrip ? 'Upravit cestu' : 'Přidat novou cestu'}
      </h2>

      {errors.submit && <div style={errorStyle}>{errors.submit}</div>}

      <div style={fieldStyle}>
        <input
          name="start"
          placeholder="Start"
          value={form.start}
          onChange={handleChange}
          style={errors.start ? { ...inputStyle, ...errorInputStyle } : inputStyle}
          aria-invalid={!!errors.start}
          aria-describedby={errors.start ? 'start-error' : undefined}
        />
        {errors.start && <span style={errorTextStyle} id="start-error">{errors.start}</span>}
      </div>

      <div style={fieldStyle}>
        <input
          name="destination"
          placeholder="Cíl"
          value={form.destination}
          onChange={handleChange}
          style={errors.destination ? { ...inputStyle, ...errorInputStyle } : inputStyle}
          aria-invalid={!!errors.destination}
          aria-describedby={errors.destination ? 'destination-error' : undefined}
        />
        {errors.destination && <span style={errorTextStyle} id="destination-error">{errors.destination}</span>}
      </div>

      <div style={fieldStyle}>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          style={errors.date ? { ...inputStyle, ...errorInputStyle } : inputStyle}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && <span style={errorTextStyle} id="date-error">{errors.date}</span>}
      </div>

      <div style={fieldStyle}>
        <input
          name="note"
          placeholder="Poznámka (volitelné)"
          value={form.note}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <select
          name="transport"
          value={form.transport}
          onChange={handleChange}
          style={errors.transport ? { ...inputStyle, ...errorInputStyle } : inputStyle}
          aria-invalid={!!errors.transport}
          aria-describedby={errors.transport ? 'transport-error' : undefined}
        >
          <option value="">Vyberte typ dopravy</option>
          <option value="Auto">Auto</option>
          <option value="Vlak">Vlak</option>
          <option value="Letadlo">Letadlo</option>
        </select>
        {errors.transport && <span style={errorTextStyle} id="transport-error">{errors.transport}</span>}
      </div>

      <button
        type="submit"
        style={isSubmitting ? { ...submitButtonStyle, ...disabledButtonStyle } : submitButtonStyle}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Ukládání...' : editingTrip ? 'Uložit změny' : 'Přidat cestu'}
      </button>
    </form>
  );
}

// 🎨 Styly
const formStyle = {
  position: 'fixed',
  top: 48, // výška headeru v px
  left: 24, // více doleva, odsazení od levého okraje
  right: 'auto', // zarovnání vlevo, ne na střed
  zIndex: 999,
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  maxWidth: '600px', // širší formulář
  width: '460px',    // pevná šířka pro větší šířku
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