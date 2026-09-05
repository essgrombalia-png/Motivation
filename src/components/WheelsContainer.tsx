import React from 'react';
import { CircularWheelOfFortune } from './CircularWheelOfFortune';
import { CategoryId, SelectedPush } from '../types';

interface WheelsContainerProps {
  onChallengeSelected: (push: SelectedPush) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  preferredCategories?: CategoryId[];
}

export const WheelsContainer: React.FC<WheelsContainerProps> = ({
  onChallengeSelected,
  isSpinning,
  setIsSpinning,
  preferredCategories = [],
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Authentic Circular Wheel of Fortune */}
      <CircularWheelOfFortune
        onChallengeSelected={onChallengeSelected}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
        preferredCategories={preferredCategories}
      />
    </div>
  );
};
