import { Card, CardContent } from "./ui/card";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className={`px-4 h-72 w-80 mx-auto`}>
      <Card
        className={`bg-gray-800 py-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow`}
      >
        <CardContent className='flex flex-col items-center'>
          <div className='mb-4 text-primary text-4xl'>{icon}</div>
          <h3 className='text-xl font-semibold'>{title}</h3>
          <p className='text-gray-400 mt-2'>{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
