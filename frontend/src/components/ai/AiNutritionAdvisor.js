import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as aiApi from '../../api/ai';

const AiNutritionAdvisor = () => {
  const { token } = useAuth();
  const [goal, setGoal] = useState('weight loss');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAdvice('');

    const prompt = `I need some nutrition advice for my goal of ${goal}. Please provide 3-4 actionable tips.`;

    try {
      const result = await aiApi.getAiSuggestion(prompt, token);
      setAdvice(result.suggestion);
    } catch (err) {
      setError(err.message || 'Could not get nutrition advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
      <h4 className="text-lg font-bold text-green-800 mb-3">🥗 AI Nutrition Advisor</h4>
      <form onSubmit={handleGenerate} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">My Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full p-2 border rounded-md">
            <option value="weight loss">Weight Loss</option>
            <option value="muscle gain">Muscle Gain</option>
            <option value="a balanced diet">Balanced Diet</option>
            <option value="more energy">More Energy</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-green-400">
          {loading ? 'Getting Advice...' : 'Get Advice'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {advice && (
        <div className="mt-4 bg-white p-4 rounded-md border">
          <h5 className="font-bold mb-2">Nutrition Tips:</h5>
          <pre className="whitespace-pre-wrap font-sans text-sm">{advice}</pre>
        </div>
      )}
    </div>
  );
};

export default AiNutritionAdvisor;