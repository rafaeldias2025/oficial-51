import React from 'react';
import KwifyStyle from './KwifyStyle';

interface PlataformaSonhosProps {
  isEmbedded?: boolean;
  onBack?: () => void;
}

export const PlataformaSonhos: React.FC<PlataformaSonhosProps> = ({
  isEmbedded = false,
  onBack
}) => {
  return <KwifyStyle />;
};

export default PlataformaSonhos; 