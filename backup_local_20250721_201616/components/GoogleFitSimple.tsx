import React from 'react';
import { GoogleFitConnection } from './GoogleFitConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface GoogleFitSimpleProps {
  userId: string;
}

export const GoogleFitSimple: React.FC<GoogleFitSimpleProps> = ({ userId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Google Fit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleFitConnection 
          userId={userId}
          onSuccess={() => console.log('Google Fit conectado!')}
        />
      </CardContent>
    </Card>
  );
};