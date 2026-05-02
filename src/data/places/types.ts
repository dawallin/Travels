export type PlaceStatus = "included" | "possible" | "avoid";
export type PlaceType = "destination" | "hotel" | "attraction" | "restaurant" | "shopping";

export interface PlaceOtherLink {
  label: string;
  url: string;
}

export interface PlaceLinks {
  googleMaps?: string;
  tripAdvisor?: string;
  official?: string;
  other?: PlaceOtherLink[];
}

export interface PlaceDetails {
  what: string;
  summary?: string;
  highlights?: string[];
  tips?: string[];
  goodToKnow?: string[];
  bestTime?: string;
}

export interface Place {
  id: string;
  title: string;
  type: PlaceType;
  status: PlaceStatus;
  parentDestinationId: string;
  description: string;
  latitude: number;
  longitude: number;

  image?: string;
  address?: string;

  heroImage?: string;
  visitOrder?: number;
  links?: PlaceLinks;
  details?: PlaceDetails;
}
