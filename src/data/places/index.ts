import type { Place } from "./types";

interface PlaceRecord {
  trip: string;
  place: Place;
}

const placeModules = import.meta.glob("./*/*.ts", { eager: true });
const parseTripFromPlaceModulePath = (path: string): string | undefined => {
  const match = path.match(/^\.\/([^/]+)\/[^/]+\.ts$/);
  return match?.[1];
};

export const getAllPlaces = (): PlaceRecord[] => {
  const records: PlaceRecord[] = [];

  for (const [path, mod] of Object.entries(placeModules)) {
    const trip = parseTripFromPlaceModulePath(path);
    const place = (mod as { default?: Place }).default;

    if (!trip || !place) {
      continue;
    }

    records.push({ trip, place });
  }

  return records;
};

export const getPlaceByTripAndId = (trip: string, placeId: string): Place | undefined =>
  getAllPlaces().find((entry) => entry.trip === trip && entry.place.id === placeId)?.place;

