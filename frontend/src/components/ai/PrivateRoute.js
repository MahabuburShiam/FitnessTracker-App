import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as aiApi from '../../api/ai';

const AiWorkoutSuggester = () => {
  const { token } = useAuth();
  const [workoutFocus, setWorkoutFocus] = useState('full body');
  const [duration, setDuration] = useState('45');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuggestion('');

    const prompt = `Generate a ${duration} minute workout plan focusing on ${workoutFocus}. Provide a list of exercises with sets and reps.`;

    try {
      const result = await aiApi.getAiSuggestion(prompt, token);
      setSuggestion(result.suggestion);
    } catch (err) {
      setError(err.message || 'Could not generate a workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
      <h4 className="text-lg font-bold text-purple-800 mb-3">✨ AI Workout Planner</h4>
      <form onSubmit={handleGenerate} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Focus Area</label>
            <select value={workoutFocus} onChange={(e) => setWorkoutFocus(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="full body">Full Body</option>
              <option value="upper body">Upper Body</option>
              <option value="lower body">Lower Body</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-purple-400">
          {loading ? 'Generating...' : 'Generate Workout'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {suggestion && (
        <div className="mt-4 bg-white p-4 rounded-md border">
          <h5 className="font-bold mb-2">Suggested Workout:</h5>
          <pre className="whitespace-pre-wrap font-sans text-sm">{suggestion}</pre>
        </div>
      )}
    </div>
  );
};

export default AiWorkoutSuggester;