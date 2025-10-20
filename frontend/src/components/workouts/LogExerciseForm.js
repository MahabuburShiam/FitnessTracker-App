import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as workoutApi from '../../api/workouts';

const LogExerciseForm = ({ sessionId, onExerciseLogged }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const exerciseData = {
        name: formData.name,
        type: 'resistance', // Defaulting to resistance as per form fields
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: Number(formData.weight),
      };
      const newExercise = await workoutApi.addExercise(sessionId, exerciseData, token);
      onExerciseLogged(newExercise);
      setFormData({ name: '', sets: '', reps: '', weight: '' }); // Reset form
    } catch (err) {
      setError(err.message || 'Failed to log exercise.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border space-y-4">
      <h4 className="text-lg font-bold text-center">Add Exercise</h4>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Exercise Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" placeholder="e.g., Bench Press" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="sets" className="block text-sm font-medium text-gray-700">Sets</label>
          <input type="number" name="sets" id="sets" value={formData.sets} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="reps" className="block text-sm font-medium text-gray-700">Reps</label>
          <input type="number" name="reps" id="reps" value={formData.reps} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" step="0.5" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-400">
        {loading ? 'Adding...' : 'Add Exercise'}
      </button>
    </form>
  );
};

export default LogExerciseForm;