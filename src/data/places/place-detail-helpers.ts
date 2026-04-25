import type {
  LegacyPlaceDetails,
  LegacyPlaceLink,
  Place,
  PlaceDetails,
  PlaceLinks,
} from "./types";

const isLegacyPlaceLinks = (links: Place["links"]): links is LegacyPlaceLink[] =>
  Array.isArray(links);

const isStrictPlaceDetails = (details: Place["details"]): details is PlaceDetails =>
  Boolean(details && !Array.isArray(details) && "what" in details && typeof details.what === "string");

const isLegacyPlaceDetails = (details: Place["details"]): details is LegacyPlaceDetails =>
  Boolean(details && !Array.isArray(details) && !("what" in details));

export const normalizePlaceLinks = (place: Place): PlaceLinks | undefined => {
  if (place.links && !isLegacyPlaceLinks(place.links)) {
    return place.links;
  }

  const normalized: PlaceLinks = {};

  if (place.googleMapsUrl) {
    normalized.googleMaps = place.googleMapsUrl;
  }

  if (place.tripadvisorUrl) {
    normalized.tripAdvisor = place.tripadvisorUrl;
  }

  if (isLegacyPlaceLinks(place.links)) {
    for (const link of place.links) {
      if (link.type === "google-maps" && !normalized.googleMaps) {
        normalized.googleMaps = link.url;
      }

      if (link.type === "tripadvisor" && !normalized.tripAdvisor) {
        normalized.tripAdvisor = link.url;
      }

      if (link.type === "official" && !normalized.official) {
        normalized.official = link.url;
      }
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

export const normalizePlaceDetails = (place: Place): PlaceDetails | undefined => {
  if (isStrictPlaceDetails(place.details)) {
    return place.details;
  }

  if (isLegacyPlaceDetails(place.details)) {
    return {
      what: place.description,
      highlights: place.details.highlights,
    };
  }

  if (place.description) {
    return {
      what: place.description,
    };
  }

  return undefined;
};
