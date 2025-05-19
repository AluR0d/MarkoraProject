export interface Place {
  id: string;
  name: string;
  zone: string;
  address: string;
  phone: string;
  second_phone: string;
  email: string[];
  website: string;
  opening_hours: string;
  rating: number;
  user_ratings_total: number;
  types: string[];
  active: boolean;
  coords: { type: 'Point'; coordinates: [number, number] };
  owner_id: number;
}
