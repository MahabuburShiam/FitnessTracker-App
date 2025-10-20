import React from 'react';

const TrainerCard = ({ trainer }) => {
  return (
    <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold">{trainer.user.name}</h3>
      <p className="text-md text-blue-600 font-medium">{trainer.specialization}</p>
      <p className="text-gray-600 my-2 truncate">{trainer.bio}</p>
      <p className="text-lg font-bold text-green-600">${trainer.rate}/hr</p>
    </div>
  );
};

export default TrainerCard;