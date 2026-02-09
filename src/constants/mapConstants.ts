export const MAP_CONFIG = {
  CENTER: [42.3, 43.5] as [number, number],
  ZOOM: 7,
  MIN_ZOOM: 6,
  MAX_ZOOM: 12,
} as const;

export const MAP_STYLES = {
  OPACITY: {
    DEFAULT: 0.2,
    SELECTED: 0.5,
    HOVER: 0.7,
  },
  WEIGHT: {
    DEFAULT: 1,
    HOVER: 2,
  },
  COLORS: {
    SELECTED: 'blue',
    DEFAULT: 'white',
    STROKE: 'white',
  },
} as const;

export const TILE_LAYERS = {
  SATELLITE: {
    URL: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ATTRIBUTION: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  OPENSTREETMAP: {
    URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ATTRIBUTION: '&copy; OpenStreetMap contributors',
  },
} as const;