import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as goalApi from '../../api/goals';

const GoalItem = ({ goal, onGoalUpdated }) => {
  const { token } = useAuth();
  const [currentValue, setCurrentValue] = useState(goal.currentValue);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentValue(goal.currentValue);
  }, [goal.currentValue]);

  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isCompleted = goal.status === 'completed';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedGoal = await goalApi.updateGoal(goal.id, { currentValue }, token);
      onGoalUpdated(updatedGoal);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update goal", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setLoading(true);
    try {
      const updatedGoal = await goalApi.updateGoal(goal.id, { status: 'completed', currentValue: goal.targetValue }, token);
      onGoalUpdated(updatedGoal);
    } catch (err) {
      console.error("Failed to complete goal", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm border-l-4 ${isCompleted ? 'bg-green-50 border-green-500' : 'bg-white border-purple-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg">{goal.description}</p>
          <p className="text-sm text-gray-500">Target: {goal.targetValue} {goal.unit} by {new Date(goal.deadline).toLocaleDateString()}</p>
        </div>
        {isCompleted && <span className="text-green-600 font-bold">Completed! 🎉</span>}
      </div>

      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-purple-700">{goal.currentValue} {goal.unit}</span>
          <span className="text-sm font-medium text-purple-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-4">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="flex items-center gap-2">
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="p-1 border rounded w-24"
              />
              <button type="submit" disabled={loading} className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 disabled:bg-purple-300">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-gray-600">Cancel</button>
            </form>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Update Progress</button>
              <button onClick={handleMarkComplete} disabled={loading} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-green-300">Mark as Complete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalItem;