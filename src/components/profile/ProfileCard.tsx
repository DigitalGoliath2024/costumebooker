import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';
import type { Profile } from '../../types';

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  // Get the main image (position 0) or first available image
  const mainImage = profile.images.find(img => img.position === 0) || profile.images[0];
  const imageUrl = mainImage?.url || 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <Link to={`/profile/${profile.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={profile.displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{profile.displayName}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile.city}, {profile.state}</span>
          </div>
          {(profile.priceMin !== null && profile.priceMax !== null) && (
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{formatCurrency(profile.priceMin)} - {formatCurrency(profile.priceMax)} / hour</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="default" className="mr-1 mb-1">
                {category}
              </Badge>
            ))}
            {profile.categories.length > 3 && (
              <Badge variant="outline" className="mr-1 mb-1">
                +{profile.categories.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProfileCard;