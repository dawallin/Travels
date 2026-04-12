export type PlaceStatus = "included" | "possible" | "avoid";
export type PlaceType = "destination" | "hotel" | "attraction";

export type PlaceLinks = {
  googleMaps?: string;
  tripAdvisor?: string;
  official?: string;
};

export type PlaceDetails = {
  what: string;
  summary?: string;
  highlights?: string[];
  tips?: string[];
  goodToKnow?: string[];
  bestTime?: string;
};

export type Place = {
  id: string;
  title: string;
  type?: PlaceType | string;
  status?: PlaceStatus;
  parentDestinationId?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  links?: PlaceLinks;
  details?: PlaceDetails;
  heroImage?: string;
  visitOrder?: number;
};
