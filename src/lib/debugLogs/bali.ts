import { createSsrLogger } from "../debugSsr";

export const getBaliInitialLogs = () => {
  const placeModules = import.meta.glob("../../data/places/bali/*.ts", { eager: true });
  const places = Object.values(placeModules).map(
    (module) => module.default ?? module.place ?? module
  );

  const validPlaceCount = places.filter(
    (place) =>
      Number.isFinite(Number(place.latitude)) &&
      Number.isFinite(Number(place.longitude)) &&
      Math.abs(Number(place.latitude)) <= 90 &&
      Math.abs(Number(place.longitude)) <= 180
  ).length;

  const logger = createSsrLogger();
  logger.log(
    "BaliPage",
    "Places loaded",
    `total: ${places.length}\nvalid lat/long: ${validPlaceCount}`
  );

  return logger.entries;
};
