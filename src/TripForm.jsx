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
    budget: {
      accommodation: '',
      transport: '',
      food: '',
      activities: '',
      other: ''
    },
    note: '',
    transport: '',
    activities: [''],
    links: [''],
    public: false,
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
        budget: typeof editingTrip.budget === 'object' && editingTrip.budget !== null
          ? editingTrip.budget
          : {
              accommodation: '',
              transport: '',
              food: '',
              activities: '',
              other: ''
            },
        activities,
        links,
        public: editingTrip.public || false,
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
  Object.entries(form.budget).forEach(([key, value]) => {
    if (value && isNaN(Number(value))) {
      if (!newErrors.budget) newErrors.budget = {};
      newErrors.budget[key] = 'Musí být číslo';
    }
  });
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
    } else if (name === 'public') {
      setForm((prev) => ({ ...prev, public: e.target.checked }));
      setErrors((prev) => ({ ...prev, public: '' }));
    } else if (name.startsWith('budget.')) {
      const budgetKey = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          [budgetKey]: value
        }
      }));
      setErrors((prev) => ({
        ...prev,
        budget: {
          ...(prev.budget || {}),
          [budgetKey]: ''
        }
      }));
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
        budget: {
          accommodation: '',
          transport: '',
          food: '',
          activities: '',
          other: ''
        },
        note: '',
        transport: '',
        activities: [''],
        links: [''],
        public: false,
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Chyba při ukládání cesty' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="fixed top-[115px] left-[50px] z-[999] bg-[#fdf6e3] border border-[#e6dcc2] rounded-[5px] shadow-lg max-w-[800px] w-[600px] max-h-[90vh] overflow-y-auto p-2 pt-[20px] pl-[75px] pr-[75px] pb-[30px]">
  <form onSubmit={handleSubmit} className="bg-white p-6 mb-12 rounded-xl w-full grid gap-[10px] font-sans pb-[20px] mb-[20px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#07689f] font-bold text-base">{user?.email}</span>
      </div>
      <h2 className="text-center text-[#07689f] mb-4 text-xl font-bold">{editingTrip ? 'Upravit cestu' : 'Přidat novou cestu'}</h2>
      {errors.submit && <div className="text-[#e74c3c] text-center text-sm mb-4">{errors.submit}</div>}

      {/* Start */}
  <div className="flex flex-col gap-[10px]">
  <input name="start" placeholder="Start" value={form.start} onChange={handleChange} className={`h-[30px] w-[350px] p-3 rounded-[4px] border text-base transition-colors ${errors.start ? 'border-[#e74c3c] bg-[#fff5f5]' : 'border-[#ccc]'}`} aria-invalid={!!errors.start} aria-describedby={errors.start ? 'start-error' : undefined} />
        {errors.start && <span className="text-[#e74c3c] text-sm mt-1" id="start-error">{errors.start}</span>}
      </div>

      {/* Cíl */}
  <div className="flex flex-col gap-[10px]">
  <input name="destination" placeholder="Cíl" value={form.destination} onChange={handleChange} className={`h-[30px] w-[350px] p-3 rounded-[4px] border text-base transition-colors ${errors.destination ? 'border-[#e74c3c] bg-[#fff5f5]' : 'border-[#ccc]'}`} aria-invalid={!!errors.destination} aria-describedby={errors.destination ? 'destination-error' : undefined} />
        {errors.destination && <span className="text-[#e74c3c] text-sm mt-1" id="destination-error">{errors.destination}</span>}
      </div>

      {/* Termín tam */}
  <div className="flex flex-col gap-[10px]">
  <input name="date" type="date" value={form.date} onChange={handleChange} className={`h-[30px] w-[350px] p-3 rounded-[4px] border text-base transition-colors ${errors.date ? 'border-[#e74c3c] bg-[#fff5f5]' : 'border-[#ccc]'}`} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-error' : undefined} />
        {errors.date && <span className="text-[#e74c3c] text-sm mt-1" id="date-error">{errors.date}</span>}
      </div>

      {/* Termín zpět */}
  <div className="flex flex-col gap-[10px]">
  <input name="returnDate" type="date" value={form.returnDate} onChange={handleChange} min={form.date ? form.date : new Date().toISOString().split('T')[0]} className={`h-[30px] w-[350px] p-3 rounded-[4px] border text-base transition-colors ${errors.returnDate ? 'border-[#e74c3c] bg-[#fff5f5]' : 'border-[#ccc]'}`} aria-invalid={!!errors.returnDate} aria-describedby={errors.returnDate ? 'returnDate-error' : undefined} />
        {errors.returnDate && <span className="text-[#e74c3c] text-sm mt-1" id="returnDate-error">{errors.returnDate}</span>}
      </div>

      {/* Rozpočtová tabulka */}
  <div className="flex flex-col gap-[10px]">
        <label>Rozpočet cesty (Kč):</label>
        <table className="w-full border-collapse mb-2">
          <thead>
            <tr className="bg-[#f5f5f5]">
              <th className="text-left p-2 border border-[#ccc]">Kategorie</th>
              <th className="text-left p-2 border border-[#ccc]">Částka (Kč)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(form.budget).map(([key, value]) => (
              <tr key={key}>
                <td className="p-2 border border-[#ccc]">{
                  key === 'accommodation' ? 'Ubytování' :
                  key === 'transport' ? 'Doprava' :
                  key === 'food' ? 'Jídlo' :
                  key === 'activities' ? 'Aktivity' :
                  key === 'other' ? 'Ostatní' : key
                }</td>
                <td className="p-2 border border-[#ccc]">
                  <div className="flex flex-col gap-[10px]">
                    <input
                      name={`budget.${key}`}
                      type="number"
                      min="0"
                      step="1"
                      value={value}
                      onChange={handleChange}
                      className={`h-[30px] w-[350px] p-3 rounded-[4px] border text-base transition-colors ${errors.budget && errors.budget[key] ? 'border-[#e74c3c] bg-[#fff5f5]' : 'border-[#ccc]'}`}
                      aria-invalid={!!(errors.budget && errors.budget[key])}
                      aria-describedby={errors.budget && errors.budget[key] ? `budget-${key}-error` : undefined}
                    />
                    {errors.budget && errors.budget[key] && <span className="text-[#e74c3c] text-sm mt-1" id={`budget-${key}-error`}>{errors.budget[key]}</span>}
                  </div>
                </td>
              </tr>
            ))}
            {/* Celkem */}
            <tr className="bg-[#eaf6ea] font-bold">
              <td className="p-2 border border-[#ccc]">Celkem</td>
              <td className="p-2 border border-[#ccc]">
                {Object.values(form.budget).reduce((sum, val) => sum + (Number(val) || 0), 0)} Kč
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Aktivity */}
  <div className="flex flex-col gap-[10px]">
        <label>Aktivity:</label>
        {form.activities.map((activity, idx) => (
          <div key={idx} className="flex gap-[10px] items-center">
            <input name={`activity-${idx}`} placeholder={`Aktivita ${idx + 1}`} value={activity} onChange={handleChange} className="h-[30px] w-[350px] p-3 rounded-[4px] border border-[#ccc] text-base" />
            <button type="button" className="bg-[#fa8072] text-white px-3 py-1 rounded-[4px] text-sm flex items-center justify-center h-[30px] border-0" onClick={() => { setForm((prev) => ({ ...prev, activities: prev.activities.filter((_, i) => i !== idx) })); }}>
              {/* Ikona křížek (X) světle béžová */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="4" x2="14" y2="14" stroke="#fdf6e3" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="4" x2="4" y2="14" stroke="#fdf6e3" strokeWidth="2" strokeLinecap="round" />
  </svg>
            </button>
          </div>
        ))}
  <button type="button" className="bg-[#07689f] text-[#f5ecd7] font-semibold text-3xl tracking-wide px-3 py-2 rounded-[4px] mt-2 h-[30px] border-0" onClick={() => { setForm((prev) => ({ ...prev, activities: [...prev.activities, ''] })); }}>Přidat aktivitu</button>
      </div>

      {/* Odkazy Booking, Mapy.cz */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-[20px] mt-2 items-center">
          <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(form.destination)}`} target="_blank" rel="noopener noreferrer" title="Booking.com">
            <span className="inline-block bg-[#f5ecd7] text-[#07689f] font-bold rounded-[4px] px-6 py-2 text-lg p-[5px]">Booking.com</span>
          </a>
          <a href={`https://mapy.cz/zakladni?query=${encodeURIComponent(form.destination)}`} target="_blank" rel="noopener noreferrer" title="Mapy.cz">
            <span className="inline-block bg-[#f5ecd7] text-[#4CAF50] font-bold rounded-[4px] px-6 py-2 text-lg p-[5px]">Mapy.cz</span>
          </a>
        </div>
      </div>

      {/* Možnost vložení vlastního odkazu */}
      <div className="flex flex-col gap-[10px]">
        <label>Odkazy:</label>
        {form.links.map((link, idx) => (
          <div key={idx} className="flex gap-[10px] items-center">
            <input
              name={`link-${idx}`}
              placeholder={`Odkaz ${idx + 1} (např. Google Docs, itinerář)`}
              value={link}
              onChange={handleChange}
              className="h-[30px] w-[350px] p-3 rounded-[4px] border border-[#ccc] text-base"
            />
            <button type="button" className="bg-[#fa8072] text-white px-3 py-1 rounded-[4px] text-sm flex items-center justify-center h-[30px] border-0" onClick={() => {
              setForm((prev) => ({
                ...prev,
                links: prev.links.filter((_, i) => i !== idx)
              }));
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="4" x2="14" y2="14" stroke="#fdf6e3" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="4" x2="4" y2="14" stroke="#fdf6e3" strokeWidth="2" strokeLinecap="round" />
  </svg>
            </button>
          </div>
        ))}
        <button type="button" className="bg-[#07689f] text-[#f5ecd7] font-semibold text-3xl tracking-wide px-3 py-2 rounded-[4px] mt-2 h-[30px] border-0" onClick={() => {
          setForm((prev) => ({ ...prev, links: [...prev.links, ''] }));
        }}>
          Přidat odkaz
        </button>
      </div>

      {/* Poznámka */}
      <div className="flex flex-col gap-1">
  <input name="note" placeholder="Poznámka (volitelné)" value={form.note} onChange={handleChange} className="h-[30px] w-[350px] p-3 rounded-[4px] border border-[#ccc] text-base" />
      </div>

      {/* Výběr transportu */}
      <div className="flex flex-col gap-1">
        <select name="transport" value={form.transport} onChange={handleChange} className={`h-[25px] p-3 rounded-[4px] border text-base transition-colors w-full ${errors.transport ? 'border-[#e74c3c] bg-[#fff5f5]' : 'border-[#ccc]'}`} aria-invalid={!!errors.transport} aria-describedby={errors.transport ? 'transport-error' : undefined}>
          <option value="">Vyberte typ dopravy</option>
          <option value="Auto">Auto</option>
          <option value="MHD">MHD</option>
          <option value="Letadlo">Letadlo</option>
        </select>
        {errors.transport && <span className="text-[#e74c3c] text-sm mt-1" id="transport-error">{errors.transport}</span>}
      </div>

      {/* Veřejná cesta */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="public"
            checked={form.public}
            onChange={handleChange}
            className="w-5 h-5"
          />
          Veřejná cesta (sdílená pro ostatní)
        </label>
      </div>

      <div>
        <button type="submit" className={`bg-[#40a798] text-[#f5ecd7] font-semibold text-3xl tracking-wide p-3 rounded-[4px] w-full transition-colors h-[40px] border-0 ${isSubmitting ? 'bg-[#a0a0a0] cursor-not-allowed' : 'hover:bg-[#359184] hover:-translate-y-[1px]'}`} disabled={isSubmitting}>
          {isSubmitting ? 'Ukládání...' : editingTrip ? 'Uložit změny' : 'Přidat cestu'}
        </button>
      </div>
      </form>
    </div>
  );
}