import type { Place } from "./types";

const placeModules = import.meta.glob("./*/**/*.ts", { eager: true });

const toPlace = (moduleValue: unknown): Place => {
  const mod = moduleValue as { default?: Place; place?: Place };

  return mod.default ?? mod.place ?? (moduleValue as Place);
};

const withTripId = (entryPath: string, place: Place) => {
  const pathParts = entryPath.split("/");
  const tripId = pathParts[pathParts.length - 2];

  return {
    tripId,
    place,
  };
};

export const getAllPlaces = () =>
  Object.entries(placeModules).map(([entryPath, moduleValue]) => withTripId(entryPath, toPlace(moduleValue)));

export const getPlaceByTripAndId = (tripId: string, placeId: string) =>
  getAllPlaces().find((entry) => entry.tripId === tripId && entry.place.id === placeId);

const markdownPlacePages = import.meta.glob("../../pages/trips/*/places/*.md", { eager: true });

export const hasMarkdownPlacePage = (tripId: string, placeId: string) =>
  Object.prototype.hasOwnProperty.call(markdownPlacePages, `../../pages/trips/${tripId}/places/${placeId}.md`);
