import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as metricsApi from '../../api/metrics';

const LogMetricsForm = ({ onMetricLogged }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    weight: '',
    sleep: '',
    energy: 5,
    mood: 5,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const metricData = {
        weight: Number(formData.weight),
        sleep: Number(formData.sleep),
        energy: Number(formData.energy),
        mood: Number(formData.mood),
      };
      const newMetric = await metricsApi.logMetric(metricData, token);
      onMetricLogged(newMetric);
      setSuccess('Metrics logged successfully!');
      // Optionally reset form
      // setFormData({ weight: '', sleep: '', energy: 5, mood: 5 });
    } catch (err) {
      setError(err.message || 'Failed to log metrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border space-y-4">
      <h3 className="text-xl font-bold text-center">Daily Check-in</h3>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
        <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" step="0.1" />
      </div>
      <div>
        <label htmlFor="sleep" className="block text-sm font-medium text-gray-700">Sleep (hours)</label>
        <input type="number" name="sleep" id="sleep" value={formData.sleep} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" step="0.1" />
      </div>
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">Mood: {formData.mood}</label>
        <input type="range" name="mood" id="mood" min="1" max="10" value={formData.mood} onChange={handleChange} className="w-full" />
      </div>
      <div>
        <label htmlFor="energy" className="block text-sm font-medium text-gray-700">Energy: {formData.energy}</label>
        <input type="range" name="energy" id="energy" min="1" max="10" value={formData.energy} onChange={handleChange} className="w-full" />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-indigo-400">
        {loading ? 'Logging...' : 'Log Today\'s Metrics'}
      </button>
    </form>
  );
};

export default LogMetricsForm;