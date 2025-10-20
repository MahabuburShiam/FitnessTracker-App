import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const RoleSelection = () => {
  const { updateRole } = useAuth();

  const handleRoleSelect = async (role) => {
    console.log(`Role selected: ${role}`);
    await updateRole(role);
  };

  const roles = [
    { name: 'Regular User', description: 'Track your fitness, log workouts, and engage with the community.', value: 'regular' },
    { name: 'Trainer', description: 'Create a professional profile, manage clients, and share your expertise.', value: 'trainer' },
    { name: 'Gym Owner', description: 'List your gym, manage facilities, and connect with members.', value: 'gym-owner' },
  ];

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
      {roles.map((role) => (
        <div
          key={role.value}
          className="border rounded-lg p-6 text-center hover:shadow-lg hover:border-blue-500 cursor-pointer transition"
          onClick={() => handleRoleSelect(role.value)}
        >
          <h3 className="text-2xl font-bold mb-2">{role.name}</h3>
          <p className="text-gray-600 mb-4">{role.description}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            I am a {role.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoleSelection;