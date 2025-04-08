import React from 'react';

interface Producer {
  _id: string;
  user: {
    profileImage: string;
    username: string;
    name: string;
    rank: {
      title: string;
      nextRankTitle: string;
      color: string;
    };
    projectsView: number;
    address: string;
  };
  minBudget: number;
  maxBudget: number;
  platforms: Array<{
    _id: string;
    name: string;
    image: string;
  }>;
}

const ProducerCard: React.FC<{ producer: Producer }> = ({ producer }) => {
  return (
    <div className="box p-5 h-full">
      <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
        <img
            alt="Midone - HTML Admin Template"
            className="rounded-md"
            src={producer.user.profileImage}
        />
        <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
            <a href="" className="block text-base font-medium">
            {producer.user.username}
            </a>
            <span className="mt-3 text-xs text-white/90">
            
            </span>
        </div>
        </div>
      <div className="mt-2">
        <p className="text-sm text-gray-500">Rank: {producer.user.rank.title}</p>
        <p className="text-sm text-gray-500">Projects Viewed: {producer.user.projectsView}</p>
        <p className="text-sm text-gray-500">Budget: ${producer.minBudget} - ${producer.maxBudget}</p>
      </div>
      <div className="mt-2">
        <h4 className="font-medium">Platforms:</h4>
        <div className="flex flex-col gap-1 mt-2">
          {producer.platforms.map(platform => (
            <div key={platform._id} className="flex items-center">
              <img src={platform.image} alt={platform.name} className="w-8 h-8 rounded" />
              <span className="ml-1">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProducerCard;