const logDebug = (message, data) => {
  window.travelsDebugLog?.("MapWidget", message, data ?? "");
};

const formatMarkerList = (items, formatter, emptyLabel = "  - none") => {
  if (!items.length) {
    return emptyLabel;
  }

  return items.map(formatter).join("\n");
};

const formatRawValue = (value) => (value === "" ? "?" : String(value));

const parseConfig = (element) => {
  const raw = element.dataset.mapConfig;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.message}${error.stack ? `\n${error.stack}` : ""}`
        : String(error);
    logDebug("Error", `Invalid map config: ${message}`);
    return null;
  }
};

const initMapWidget = (element) => {
  if (element.dataset.mapInitialized === "true") {
    return;
  }
  element.dataset.mapInitialized = "true";
  element.dataset.mapFullscreen = "false";

  const config = parseConfig(element);
  if (!config) {
    return;
  }

  const {
    mapId,
    fullscreenMapId,
    markers = [],
    mapTilerKey,
    markerIcons = {},
    singleMarkerZoom,
    totalMarkers,
    validMarkersCount,
    invalidMarkersCount,
    invalidMarkers = [],
    shouldRenderMap,
  } = config;

  const keyPresent = Boolean(mapTilerKey);
  const keyLength = mapTilerKey?.length ?? 0;
  const keyPrefix = keyPresent ? mapTilerKey.slice(0, 4) : "";
  const initData = [
    `url: ${window.location.href}`,
    shouldRenderMap ? `container: #${mapId}` : "container: (not rendered)",
    `maptilerKeyPresent: ${keyPresent}`,
    `maptilerKeyLen: ${keyLength}`,
    keyPresent ? `maptilerKeyPrefix: ${keyPrefix}` : null,
    `markersTotal: ${totalMarkers ?? markers.length}`,
    `markersValid: ${validMarkersCount ?? markers.length}`,
    `markersInvalid: ${invalidMarkersCount ?? invalidMarkers.length}`,
  ]
    .filter(Boolean)
    .join("\n");
  const markersData = [
    "valid:",
    formatMarkerList(
      markers,
      (marker) => `  - ${marker.title}: ${marker.lat}, ${marker.lon}`
    ),
    "invalid:",
    formatMarkerList(
      invalidMarkers,
      (marker) =>
        `  - ${marker.title}: ${formatRawValue(marker.rawLat)}, ${formatRawValue(
          marker.rawLon
        )} (${marker.issues.join(", ")})`
    ),
  ].join("\n");

  logDebug("Init", initData);
  logDebug("Markers", markersData);

  if (!shouldRenderMap) {
    return;
  }

  const mapElement = document.getElementById(mapId);
  if (!mapElement) {
    logDebug("Error", `Missing map container #${mapId}`);
    return;
  }

  if (!keyPresent || markers.length === 0) {
    logDebug("Error", "Missing MapTiler key or markers; skipping map init.");
    return;
  }

  try {
    const { L } = window;
    if (!L) {
      logDebug("Error", "Leaflet not loaded; skipping map init.");
      return;
    }

    const iconDefaults = {
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
      tooltipAnchor: [0, -24],
    };
    const iconCache = new Map();
    const iconFor = (iconUrl) => {
      if (!iconUrl) {
        return null;
      }
      if (iconCache.has(iconUrl)) {
        return iconCache.get(iconUrl);
      }
      const icon = L.icon({ iconUrl, ...iconDefaults });
      iconCache.set(iconUrl, icon);
      return icon;
    };
    const normalizeType = (value) => String(value ?? "").trim().toLowerCase();
    const resolveMarkerIcon = (marker) => {
      const type = normalizeType(marker.type);
      if (type === "hotel") {
        return iconFor(markerIcons.bed);
      }
      if (["attraction", "sight", "activity", "landmark"].includes(type)) {
        return iconFor(markerIcons.landmark);
      }
      if (["destination", "place"].includes(type) || type.length === 0) {
        return iconFor(markerIcons.pin);
      }
      return iconFor(markerIcons.pin);
    };
    const defaultIcon = iconFor(markerIcons.pin);
    if (defaultIcon) {
      L.Icon.Default.mergeOptions({
        iconUrl: markerIcons.pin,
        iconRetinaUrl: markerIcons.pin,
        shadowUrl: "",
      });
    }

    const createLeafletMap = (targetElement, contextLabel) => {
      logDebug("Loading", `${contextLabel}: initializing Leaflet.`);
      const map = L.map(targetElement, {
        scrollWheelZoom: false,
      });

      const tileLayer = L.tileLayer(
        `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapTilerKey}`,
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      );
      tileLayer.on("tileerror", (event) => {
        const error = event?.error;
        const errorMessage =
          error instanceof Error
            ? `${error.message}${error.stack ? `\n${error.stack}` : ""}`
            : error
              ? String(error)
              : "Unknown tile error";
        logDebug("Tile error", errorMessage);
      });

      tileLayer.addTo(map);

      const bounds = L.latLngBounds([]);

      markers.forEach((marker) => {
        const position = [marker.lat, marker.lon];
        const icon = resolveMarkerIcon(marker) ?? defaultIcon;
        L.marker(position, { title: marker.title, icon }).addTo(map);
        bounds.extend(position);
      });

      let boundsDecision = "none";
      let fitBounds = false;
      if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lon], singleMarkerZoom);
        boundsDecision = "single marker zoom";
      } else if (markers.length > 1) {
        map.fitBounds(bounds, { padding: [24, 24] });
        boundsDecision = "fit bounds";
        fitBounds = true;
      }

      logDebug(
        "Ready",
        [
          `markersPlaced: ${markers.length}`,
          `fitBounds: ${fitBounds}`,
          `boundsDecision: ${boundsDecision}`,
          "tiles: requested",
        ].join("\n")
      );

      return {
        map,
        bounds,
        fitBounds,
        singleMarker: markers.length === 1,
      };
    };

    createLeafletMap(mapElement, "Inline map");
    let fullscreenState = null;
    let isFullscreen = false;
    const modal = element.querySelector("[data-map-widget-modal]");
    const fullscreenMapElement = fullscreenMapId
      ? document.getElementById(fullscreenMapId)
      : null;
    const toggleButtons = element.querySelectorAll("[data-map-widget-toggle]");
    const bodyClass = "map-widget--no-scroll";

    const syncFullscreenState = () => {
      element.dataset.mapFullscreen = String(isFullscreen);
      if (modal) {
        modal.hidden = !isFullscreen;
        modal.setAttribute("aria-hidden", String(!isFullscreen));
      }
      toggleButtons.forEach((button) => {
        button.setAttribute("aria-label", isFullscreen ? "Collapse map" : "Expand map");
      });
      document.body.classList.toggle(bodyClass, isFullscreen);
    };

    const closeFullscreen = () => {
      if (!isFullscreen) {
        return;
      }
      isFullscreen = false;
      syncFullscreenState();
      document.removeEventListener("keydown", handleKeydown);
    };

    const openFullscreen = () => {
      if (isFullscreen) {
        return;
      }
      if (!fullscreenMapElement) {
        logDebug("Error", "Missing fullscreen map container.");
        return;
      }
      isFullscreen = true;
      syncFullscreenState();
      document.addEventListener("keydown", handleKeydown);

      if (!fullscreenState) {
        fullscreenState = createLeafletMap(fullscreenMapElement, "Fullscreen map");
      }

      requestAnimationFrame(() => {
        fullscreenState?.map.invalidateSize();
        if (fullscreenState?.fitBounds) {
          fullscreenState.map.fitBounds(fullscreenState.bounds, { padding: [24, 24] });
        } else if (fullscreenState?.singleMarker && markers[0]) {
          fullscreenState.map.setView([markers[0].lat, markers[0].lon], singleMarkerZoom);
        }
      });
    };

    const toggleFullscreen = () => {
      if (isFullscreen) {
        closeFullscreen();
      } else {
        openFullscreen();
      }
    };

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }
    };

    toggleButtons.forEach((button) => {
      button.addEventListener("click", toggleFullscreen);
    });

    if (!modal) {
      logDebug("Error", "Missing fullscreen modal wrapper.");
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.message}${error.stack ? `\n${error.stack}` : ""}`
        : String(error);
    logDebug("Error", message);
  }
};

document.querySelectorAll("[data-map-widget]").forEach(initMapWidget);
