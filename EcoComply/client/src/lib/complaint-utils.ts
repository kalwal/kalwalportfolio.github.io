import { Wind, Droplets, Trash2, Volume2, Factory, AlertTriangle } from "lucide-react";

export function getCategoryIcon(category: string) {
  switch (category) {
    case 'air':
      return Wind;
    case 'water':
      return Droplets;
    case 'waste':
      return Trash2;
    case 'noise':
      return Volume2;
    case 'industrial':
      return Factory;
    default:
      return AlertTriangle;
  }
}

export function getCategoryColor(category: string) {
  switch (category) {
    case 'air':
      return 'bg-blue-100 text-blue-700';
    case 'water':
      return 'bg-cyan-100 text-cyan-700';
    case 'waste':
      return 'bg-orange-100 text-orange-700';
    case 'noise':
      return 'bg-purple-100 text-purple-700';
    case 'industrial':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'under_review':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getLocationString() {
  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}
