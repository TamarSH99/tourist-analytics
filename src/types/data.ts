/**
 * Season typing - strictly defined values
 * Used for chart color injection and filtering
 */
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

/**
 * Monthly data interface
 */
export interface MonthlyData {
  m: string;       // Month name (e.g., "Jan", "Feb")
  v: number;       // Visitor count (Value)
  s: Season;       // Season identifier
}

/**
 * Segmentation interface (for Pie Chart)
 */
export interface Segment {
  label: string;   // e.g., "Europe", "Asia", or a specific country
  value: number;   // Percentage share or absolute count
  subSegments?: Segment[]; // Sub-segments (e.g., countries within a continent)
}

/**
 * Statistical model for a specific region within a single year
 */
export interface RegionYearlyStats {
  id: string;               // Unique region ID (e.g., "GE-AJ")
  total_visitors: number;   // Yearly total
  monthly: MonthlyData[];   // 12-month array
  continents: Segment[];    // Demographic/geographic breakdown
}

/**
 * Main database structure (for statistics.json)
 * Keys are year, then region ID
 */
export interface StatisticsDB {
  [year: string]: {
    [regionId: string]: RegionYearlyStats;
  };
}

/**
 * Regions registry (for registry.json)
 * Contains information that does not change by year
 */
export interface RegistryEntry {
  id: string;
  name: string;             // Georgian name
  monuments: string[];      // Cultural heritage sites
  baseColor: string;        // Base region color on the map (Theme color)
  coordinates: [number, number]; // Center point for map focus
}

export interface RegistryDB {
  [regionId: string]: RegistryEntry;
}

/**
 * Application global filter state
 */
export interface DashboardFilters {
  selectedYear: number;
  selectedRegions: string[];
  viewMode: 'yearly' | 'monthly';
  comparisonMode: boolean;
}
