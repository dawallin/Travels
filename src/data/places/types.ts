export type PlaceStatus = "included" | "possible" | "avoid";
export type PlaceType = "destination" | "hotel" | "attraction" | "restaurant" | "shopping";

export interface PlaceLinks {
  googleMaps?: string;
  tripAdvisor?: string;
  official?: string;
}

export interface PlaceDetails {
  what: string;
  summary?: string;
  highlights?: string[];
  tips?: string[];
  goodToKnow?: string[];
  bestTime?: string;
}

export interface LegacyPlaceLink {
  type: string;
  url: string;
}

export interface LegacyPlaceDetails {
  highlights?: string[];
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
  googleMapsUrl?: string;
  tripadvisorUrl?: string;
  highlights?: string[];

  heroImage?: string;
  visitOrder?: number;
  links?: PlaceLinks | LegacyPlaceLink[];
  details?: PlaceDetails | LegacyPlaceDetails;
}
