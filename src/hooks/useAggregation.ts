import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import statsData from '../assets/data/statistics.json';
import { type StatisticsDB } from '../types/data';

const DATA = statsData as unknown as StatisticsDB;

export const useAggregation = () => {
  const { selectedYear, selectedMonth, selectedRegionIds, viewMode, isComparisonMode, comparisonRegions } = useAppSelector((state) => state.stats);

  return useMemo(() => {
    console.log('=== AGGREGATION DEBUG ===');
    console.log('Selected year:', selectedYear);
    console.log('View mode:', viewMode);
    console.log('Comparison mode:', isComparisonMode);
    console.log('Comparison regions:', comparisonRegions);
    
    const yearData = DATA[selectedYear.toString()];
    
    if (!yearData) {
      return { 
        visitorData: [], 
        continentsData: [], 
        comparisonData: null,
        insights: { title: 'No Data', subtitle: '', recommendation: '' } 
      };
    }

    if (isComparisonMode && comparisonRegions.region1 && comparisonRegions.region2) {
      // COMPARISON MODE
      return getComparisonData(yearData, comparisonRegions, selectedYear, viewMode);
    } else {
      // NORMAL MODE
      const regionsToSum = selectedRegionIds.length > 0 ? selectedRegionIds : Object.keys(yearData);
      return getNormalData(yearData, regionsToSum, selectedYear, viewMode);
    }
    
  }, [selectedYear, selectedMonth, selectedRegionIds, viewMode, isComparisonMode, comparisonRegions]);
};

function getNormalData(yearData: any, regionsToSum: string[], selectedYear: number, viewMode: string) {
  try {
    // ALWAYS aggregate continent data for current year (not affected by monthly/yearly view)
    const continentTotals: Record<string, number> = {};
    
    regionsToSum.forEach(regionId => {
      const regionStats = yearData[regionId];
      if (regionStats && regionStats.continents) {
        regionStats.continents.forEach((continent: any) => {
          continentTotals[continent.label] = (continentTotals[continent.label] || 0) + continent.value;
        });
      }
    });

    const continentsData = Object.entries(continentTotals).map(([name, value]) => ({
      name,
      value
    }));

    // Visitor data based on view mode
    let visitorData = [];
    
    if (viewMode === 'yearly') {
      const availableYears = Object.keys(DATA).map(year => parseInt(year)).sort();
      visitorData = availableYears.map(year => {
        const currentYearData = DATA[year.toString()];
        if (!currentYearData) return { name: year.toString(), visitors: 0 };

        let totalVisitors = 0;
        regionsToSum.forEach(regionId => {
          const regionStats = currentYearData[regionId];
          if (regionStats && typeof regionStats.total_visitors === 'number') {
            totalVisitors += regionStats.total_visitors;
          }
        });

        return { name: year.toString(), visitors: totalVisitors };
      });
    } else {
      // Monthly view
      const monthlyTotals: Record<string, number> = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
      };

      regionsToSum.forEach(regionId => {
        const regionStats = yearData[regionId];
        if (regionStats && regionStats.monthly && Array.isArray(regionStats.monthly)) {
          regionStats.monthly.forEach((monthData: any) => {
            if (monthData && monthData.m && typeof monthData.v === 'number') {
              monthlyTotals[monthData.m] = (monthlyTotals[monthData.m] || 0) + monthData.v;
            }
          });
        }
      });

      visitorData = Object.entries(monthlyTotals).map(([month, visitors]) => ({
        name: month,
        visitors
      }));
    }

    const totalVisitors = continentsData.reduce((sum, continent) => sum + (continent.value || 0), 0);
    const topContinent = continentsData.length > 0 
      ? continentsData.reduce((max, continent) => 
          (continent.value || 0) > (max.value || 0) ? continent : max)
      : { name: '', value: 0 };

    const insights = {
      title: `${selectedYear} Tourism Overview`,
      subtitle: totalVisitors > 0 ? `${(totalVisitors / 1000000).toFixed(1)}M total visitors` : 'No data available',
      recommendation: topContinent.name ? `${topContinent.name} leads with ${((topContinent.value || 0) / totalVisitors * 100).toFixed(0)}% market share` : ''
    };

    return { visitorData, continentsData, comparisonData: null, insights };
  } catch (error) {
    console.error('Error in getNormalData:', error);
    return { 
      visitorData: [], 
      continentsData: [], 
      comparisonData: null,
      insights: { title: 'Error Loading Data', subtitle: '', recommendation: '' } 
    };
  }
}

function getComparisonData(yearData: any, comparisonRegions: any, selectedYear: number, viewMode: string) {
  try {
    const { region1, region2 } = comparisonRegions;
    
    // Get data for both regions
    const region1Data = yearData[region1];
    const region2Data = yearData[region2];
    
    if (!region1Data || !region2Data) {
      return { 
        visitorData: [], 
        continentsData: [], 
        comparisonData: null,
        insights: { title: 'Comparison Data Unavailable', subtitle: '', recommendation: '' } 
      };
    }

    // Visitor data comparison
    let visitorData = [];
    
    if (viewMode === 'yearly') {
      const availableYears = Object.keys(DATA).map(year => parseInt(year)).sort();
      visitorData = availableYears.map(year => {
        const currentYearData = DATA[year.toString()];
        if (!currentYearData) {
          return {
            name: year.toString(),
            [region1]: 0,
            [region2]: 0,
          };
        }

        const r1Data = currentYearData[region1];
        const r2Data = currentYearData[region2];
        
        return {
          name: year.toString(),
          [region1]: r1Data?.total_visitors || 0,
          [region2]: r2Data?.total_visitors || 0,
        };
      });
    } else {
      // Monthly comparison
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const region1Monthly: Record<string, number> = {};
      const region2Monthly: Record<string, number> = {};
      
      monthNames.forEach(month => {
        region1Monthly[month] = 0;
        region2Monthly[month] = 0;
      });
      
      if (region1Data.monthly && Array.isArray(region1Data.monthly)) {
        region1Data.monthly.forEach((monthData: any) => {
          if (monthData && monthData.m && typeof monthData.v === 'number') {
            region1Monthly[monthData.m] = monthData.v;
          }
        });
      }
      
      if (region2Data.monthly && Array.isArray(region2Data.monthly)) {
        region2Data.monthly.forEach((monthData: any) => {
          if (monthData && monthData.m && typeof monthData.v === 'number') {
            region2Monthly[monthData.m] = monthData.v;
          }
        });
      }
      
      visitorData = monthNames.map(month => ({
        name: month,
        [region1]: region1Monthly[month] || 0,
        [region2]: region2Monthly[month] || 0,
      }));
    }

    // Continent data comparison - ALWAYS use current year data
    const region1Continents: Record<string, number> = {};
    const region2Continents: Record<string, number> = {};
    
    if (region1Data.continents && Array.isArray(region1Data.continents)) {
      region1Data.continents.forEach((continent: any) => {
        if (continent && continent.label && typeof continent.value === 'number') {
          region1Continents[continent.label] = continent.value;
        }
      });
    }
    
    if (region2Data.continents && Array.isArray(region2Data.continents)) {
      region2Data.continents.forEach((continent: any) => {
        if (continent && continent.label && typeof continent.value === 'number') {
          region2Continents[continent.label] = continent.value;
        }
      });
    }
    
    // Merge continent data for comparison
    const allContinents = new Set([...Object.keys(region1Continents), ...Object.keys(region2Continents)]);
    const continentsData = Array.from(allContinents).map(continent => ({
      name: continent,
      [region1]: region1Continents[continent] || 0,
      [region2]: region2Continents[continent] || 0,
    }));

    const insights = {
      title: `Comparison: ${region1} vs ${region2}`,
      subtitle: `${selectedYear} - ${viewMode} analysis`,
      recommendation: 'Comparing tourism patterns between selected regions'
    };

    return { 
      visitorData, 
      continentsData, 
      comparisonData: { region1, region2 }, 
      insights 
    };
  } catch (error) {
    console.error('Error in getComparisonData:', error);
    return { 
      visitorData: [], 
      continentsData: [], 
      comparisonData: null,
      insights: { title: 'Comparison Error', subtitle: '', recommendation: '' } 
    };
  }
}