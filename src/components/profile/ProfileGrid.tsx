import React from 'react';
import ProfileCard from './ProfileCard';
import type { Profile } from '../../types';

type ProfileGridProps = {
  profiles: Profile[];
  emptyMessage?: string;
};

const ProfileGrid: React.FC<ProfileGridProps> = ({ 
  profiles, 
  emptyMessage = "No profiles found matching your criteria." 
}) => {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
};

export default ProfileGrid;