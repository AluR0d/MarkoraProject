import { Place } from './Place';

export type Campaign = {
  id: number;
  title: string;
  message_template: string;
  created_at: string;
  active: boolean;
  frequency: number | null;
  last_sent_at: string | null;
  campaignPlaces: {
    place: Place;
    status: 'PENDING' | 'SENT';
    sent_at?: string | null;
    send_count?: number;
  }[];
};
