import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as gymApi from '../../api/gyms';
import * as trainerApi from '../../api/trainers';
import * as journalApi from '../../api/journal';
import CreateJournalEntryForm from '../journal/CreateJournalEntryForm';
import CommunityFeed from '../community/CommunityFeed';
import * as goalApi from '../../api/goals';
import * as workoutApi from '../../api/workouts';
import * as messageApi from '../../api/messages';
import * as metricsApi from '../../api/metrics';
import CreateGoalForm from '../goals/CreateGoalForm';
import GoalItem from '../goals/GoalItem';
import ChatWindow from '../messages/ChatWindow';
import Spinner from '../common/Spinner';
import MainDashboardTab from './tabs/MainDashboardTab';

const RegularDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, token } = useAuth();

  // State for Gym Discovery
  const [gymSearch, setGymSearch] = useState({ location: '', facilities: '' });
  const [gyms, setGyms] = useState([]);
  const [gymLoading, setGymLoading] = useState(false);
  const [gymError, setGymError] = useState('');

  // State for Trainer Discovery
  const [trainerFilters, setTrainerFilters] = useState({ specialization: '', maxRate: '' });
  const [trainers, setTrainers] = useState([]);
  const [trainerLoading, setTrainerLoading] = useState(true);
  const [trainerError, setTrainerError] = useState('');

  // State for Personal Journal
  const [entries, setEntries] = useState([]);
  const [journalLoading, setJournalLoading] = useState(true);
  const [journalError, setJournalError] = useState('');

  // State for Daily Metrics
  const [metrics, setMetrics] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');

  // State for Workout Logging
  const [sessions, setSessions] = useState([]);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [activeSession, setActiveSession] = useState(null);

  // State for Goal Management
  const [goals, setGoals] = useState([]);
  const [goalLoading, setGoalLoading] = useState(true);
  const [goalError, setGoalError] = useState('');

  // State for Messaging
  const [conversations, setConversations] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  // const [messageLoading, setMessageLoading] = useState(true); // This state is not used

  useEffect(() => {
    // Fetch trainers
    trainerApi.getAllTrainers(token, trainerFilters)
      .then(setTrainers)
      .catch(err => setTrainerError(err.message))
      .finally(() => setTrainerLoading(false));

    // Fetch journal entries
    journalApi.getMyEntries(token)
      .then(setEntries)
      .catch(err => setJournalError(err.message))
      .finally(() => setJournalLoading(false));

    // Fetch metrics
    metricsApi.getMyMetrics(token)
      .then(data => setMetrics(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch(err => setMetricsError(err.message))
      .finally(() => setMetricsLoading(false));

    // Fetch workout sessions
    workoutApi.getMySessions(token)
      .then(data => setSessions(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch(err => setSessionError(err.message))
      .finally(() => setSessionLoading(false));

    // Fetch goals
    goalApi.getMyGoals(token)
      .then(setGoals)
      .catch(err => setGoalError(err.message))
      .finally(() => setGoalLoading(false));

    // Fetch conversations for messaging
    // This will run when the component mounts
    messageApi.getMyConversations(token)
      .then(setConversations)
      .catch(err => console.error("Failed to load conversations", err));
  }, [token, trainerFilters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setTrainerLoading(true);
      trainerApi.getAllTrainers(token, trainerFilters)
        .then(setTrainers)
        .catch(err => setTrainerError(err.message))
        .finally(() => setTrainerLoading(false));
    }, 500); // Debounce filter changes
    return () => clearTimeout(handler);
  }, [trainerFilters, token]);

  const handleGymSearch = useCallback(async (e) => {
    e.preventDefault();

    setGymLoading(true);
    setGymError('');
    try {
      const results = await gymApi.searchGyms(gymSearch.location, gymSearch.facilities, token);
      setGyms(results);
    } catch (err) {
      setGymError(err.message || 'Could not find gyms.');
      setGyms([]);
    } finally {
      setGymLoading(false);
    }
  }, [gymSearch, token]);

  const handleGymFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setGymSearch(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNewEntry = useCallback((newEntry) => {
    setEntries(prevEntries => [newEntry, ...prevEntries]);
  }, []);

  const handleNewMetric = useCallback((newMetric) => {
    setMetrics(prevMetrics => [newMetric, ...prevMetrics].sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleStartSession = useCallback(async () => {
    try {
      const sessionName = `Workout - ${new Date().toLocaleDateString()}`;
      const newSession = await workoutApi.startSession({ name: sessionName, date: new Date() }, token);
      setActiveSession(newSession);
    } catch (err) {
      setSessionError(err.message || 'Could not start a new session.');
    }
  }, [token]);

  const handleExerciseLogged = useCallback((newExercise) => {
    // Add the new exercise to the active session's list
    setActiveSession(prevSession => ({
      ...prevSession,
      ExerciseLogs: [...(prevSession.ExerciseLogs || []), newExercise]
    }));
  }, []);

  const handleFinishSession = useCallback(() => {
    // Add the completed session to the top of the sessions list and clear the active one
    setSessions(prev => [activeSession, ...prev]);
    setActiveSession(null);
  }, [activeSession]);

  const handleGoalCreated = useCallback((newGoal) => {
    setGoals(prevGoals => [newGoal, ...prevGoals]);
  }, []);

  const handleGoalUpdated = useCallback((updatedGoal) => {
    setGoals(prevGoals => prevGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  }, []);

  const handleStartConversation = useCallback((trainer) => {
    setSelectedRecipient({ id: trainer.user._id, name: trainer.user.name });
    setActiveTab('messages');
  }, []);

  const handleTrainerFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setTrainerFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const refreshConversations = useCallback(() => {
    messageApi.getMyConversations(token).then(setConversations);
  }, [token]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'community':
        return <CommunityFeed />;
      case 'journal':
        return renderJournalTab();
      case 'goals':
        return renderGoalsTab();
      case 'messages':
        return renderMessagesTab();
      case 'dashboard':
      default:
        return <MainDashboardTab
          gymProps={{ gymSearch, handleGymFilterChange, handleGymSearch, gymLoading, gymError, gyms }}
          trainerProps={{ trainerFilters, handleTrainerFilterChange, trainerLoading, trainerError, trainers, handleStartConversation }}
          workoutProps={{ sessionError, activeSession, handleFinishSession, handleExerciseLogged, handleStartSession, sessionLoading, sessions }}
          metricsProps={{ handleNewMetric, metricsLoading, metricsError, metrics }}
        />;
    }
  };

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === tabName ? 'bg-white border-b-0 border-l border-t border-r' : 'bg-gray-100'}`}
    >
      {label}
    </button>
  );

  const renderJournalTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-bold mb-4">Personal Journal</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <CreateJournalEntryForm onEntryCreated={handleNewEntry} />
        </div>
        <div className="max-h-[34rem] overflow-y-auto pr-2">
          <h3 className="text-xl font-bold mb-4">My Entries</h3>
          {journalLoading && <Spinner text="Loading entries..." />}
          {journalError && <p className="text-red-500">{journalError}</p>}
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className={`border-l-4 pl-4 py-2 ${entry.isPublic ? 'border-green-500' : 'border-blue-500'}`}>
                <p className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleDateString()} - <span className="font-semibold">{entry.category}</span> {entry.isPublic && <span className="text-green-600 font-bold">(Public)</span>}</p>
                <h4 className="font-bold">{entry.title}</h4>
                <p className="text-gray-700">{entry.content}</p>
              </div>
            ))}
            {!journalLoading && entries.length === 0 && <p>You haven't written any entries yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-bold mb-4">Goal Management</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <CreateGoalForm onGoalCreated={handleGoalCreated} />
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">My Active Goals</h3>
          {goalLoading && <Spinner text="Loading goals..." />}
          {goalError && <p className="text-red-500">{goalError}</p>}
          <div className="space-y-4">
            {goals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onGoalUpdated={handleGoalUpdated} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="bg-white rounded-lg shadow-md mt-4 h-[70vh]">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 border-r">
          <h2 className="text-xl font-bold p-4 border-b">Conversations</h2>
          <div className="overflow-y-auto">
            {conversations.map(convo => (
              <div
                key={convo.id}
                onClick={() => setSelectedRecipient({ id: convo.participant.id, name: convo.participant.name })}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedRecipient?.id === convo.participant.id ? 'bg-blue-100' : ''}`}
              >
                <p className="font-semibold">{convo.participant.name}</p>
                <p className="text-sm text-gray-600 truncate">{convo.lastMessage.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-8">
          <ChatWindow recipient={selectedRecipient} onMessageSent={refreshConversations} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">Regular User Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name}!</p>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <TabButton tabName="dashboard" label="My Dashboard" />
          <TabButton tabName="journal" label="My Journal" />
          <TabButton tabName="community" label="Community" />
          <TabButton tabName="goals" label="My Goals" />
          <TabButton tabName="messages" label="Messages" />
        </nav>
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default RegularDashboard;