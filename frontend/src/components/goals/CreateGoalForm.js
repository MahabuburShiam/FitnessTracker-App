import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as goalApi from '../../api/goals';

const goalTypes = ['Weight Management', 'Fitness Milestones', 'Habit Building'];
const units = {
  'Weight Management': ['kg', 'lbs'],
  'Fitness Milestones': ['km', 'miles', 'reps', 'minutes'],
  'Habit Building': ['days', 'times'],
};

const CreateGoalForm = ({ onGoalCreated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    type: 'Weight Management',
    description: '',
    targetValue: '',
    unit: 'kg',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, unit: units[prev.type][0] }));
  }, [formData.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newGoal = await goalApi.createGoal(formData, token);
      onGoalCreated(newGoal);
      setFormData({ type: 'Weight Management', description: '', targetValue: '', unit: 'kg', deadline: '' }); // Reset form
    } catch (err) {
      setError(err.message || 'Failed to create goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-2xl font-bold text-center">Set a New Goal</h3>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Goal Type</label>
        <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
          {goalTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input type="text" name="description" placeholder="e.g., Lose 5kg, Run a 10k" value={formData.description} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Target</label>
          <input type="number" name="targetValue" placeholder="e.g., 10" value={formData.targetValue} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select name="unit" value={formData.unit} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white">
            {units[formData.type].map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline</label>
        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:bg-purple-400">
        {loading ? 'Setting Goal...' : 'Set Goal'}
      </button>
    </form>
  );
};

export default CreateGoalForm;