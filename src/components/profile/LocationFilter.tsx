import React from 'react';
import Select from '../ui/Select';
import { STATES } from '../../types';

type LocationFilterProps = {
  selectedState: string;
  selectedCity: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
};

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
}) => {
  const stateOptions = [
    { value: '', label: 'All States' },
    ...STATES.map((state) => ({
      value: state.abbreviation,
      label: state.name,
    })),
  ];

  const selectedStateObj = STATES.find(
    (state) => state.abbreviation === selectedState
  );

  const cityOptions = selectedStateObj
    ? [
        { value: '', label: 'All Cities' },
        ...selectedStateObj.cities.map((city) => ({
          value: city,
          label: city,
        })),
      ]
    : [{ value: '', label: 'All Cities' }];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Location</h3>
      <div className="space-y-4">
        <Select
          label="State"
          options={stateOptions}
          value={selectedState}
          onChange={(e) => {
            onStateChange(e.target.value);
            onCityChange('');
          }}
        />
        <Select
          label="City"
          options={cityOptions}
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={!selectedState}
        />
      </div>
    </div>
  );
};

export default LocationFilter;