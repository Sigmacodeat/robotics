import React from 'react';

interface SplitSectionProps {
  left: React.ReactNode;
  right: React.ReactNode;
  reverseOnMobile?: boolean;
}

export const SplitSection: React.FC<SplitSectionProps> = ({
  left,
  right,
  reverseOnMobile = false,
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-8 ${reverseOnMobile ? 'flex-col-reverse' : ''}`}>
      <div className="flex-1">
        {left}
      </div>
      <div className="flex-1">
        {right}
      </div>
    </div>
  );
};
