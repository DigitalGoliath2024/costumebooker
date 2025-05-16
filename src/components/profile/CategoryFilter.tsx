import React from 'react';
import { CATEGORIES } from '../../types';
import Checkbox from '../ui/Checkbox';

type CategoryFilterProps = {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onChange,
}) => {
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Categories</h3>
      <div className="space-y-2">
        {CATEGORIES.map((category) => (
          <Checkbox
            key={category}
            id={`category-${category}`}
            label={category}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;