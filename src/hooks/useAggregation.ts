import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import statsData from '../assets/data/statistics.json';
import { type StatisticsDB } from '../types/data';

const DATA = statsData as unknown as StatisticsDB;

export const useAggregation = () => {
  const { selectedYear, selectedMonth, selectedRegionIds, viewMode, isComparisonMode, comparisonRegions } = useAppSelector((state) => state.stats);

  return useMemo(() => {
    const yearData = DATA[selectedYear.toString()];
    
    if (!yearData) {
      return { 
        visitorData: [], 
        continentsData: [], 
        comparisonData: null,
        insights: { title: 'No Data Available', subtitle: 'Unable to load tourism statistics', recommendation: 'Please select a different year or region' } 
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

    // Calculate insights
    const totalVisitors = continentsData.reduce((sum, continent) => sum + (continent.value || 0), 0);
    const topContinent = continentsData.length > 0 
      ? continentsData.reduce((max, continent) => 
          (continent.value || 0) > (max.value || 0) ? continent : max)
      : { name: '', value: 0 };

    // Get growth trend for recommendation
    const currentYearTotal = visitorData.find(item => item.name === selectedYear.toString())?.visitors || 0;
    const previousYearTotal = visitorData.find(item => item.name === (selectedYear - 1).toString())?.visitors || 0;
    const growthRate = previousYearTotal > 0 ? ((currentYearTotal - previousYearTotal) / previousYearTotal * 100) : 0;

    const regionText = regionsToSum.length === Object.keys(yearData).length ? 'All Georgia' : `${regionsToSum.length} selected region${regionsToSum.length === 1 ? '' : 's'}`;

    const insights = {
      title: viewMode === 'yearly' ? 'Tourism Trends Analysis' : `Monthly Tourism Pattern`,
      subtitle: viewMode === 'yearly' 
        ? `Multi-year visitor flow analysis for ${regionText}` 
        : `${selectedYear} monthly visitor distribution for ${regionText}`,
      recommendation: totalVisitors > 0 
        ? (viewMode === 'yearly' 
            ? (growthRate > 5 ? `Strong growth trend: +${growthRate.toFixed(1)}% year-over-year increase` 
               : growthRate < -5 ? `Declining trend: ${growthRate.toFixed(1)}% year-over-year decrease` 
               : `Stable tourism pattern with ${(totalVisitors / 1000000).toFixed(1)}M total visitors`)
            : `Peak season analysis shows ${(Math.max(...visitorData.map(d => d.visitors)) / 1000).toFixed(0)}K monthly high`)
        : 'Insufficient data for trend analysis'
    };

    return { visitorData, continentsData, comparisonData: null, insights };
  } catch (error) {
    console.error('Error in getNormalData:', error);
    return { 
      visitorData: [], 
      continentsData: [], 
      comparisonData: null,
      insights: { title: 'Data Processing Error', subtitle: 'Unable to process tourism data', recommendation: 'Please check data integrity or try refreshing' } 
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
        insights: { title: 'Regional Comparison', subtitle: 'Missing data for selected regions', recommendation: 'Please select regions with available data for comparison' } 
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

    // Calculate comparison insights
    const region1Total = region1Data.total_visitors || 0;
    const region2Total = region2Data.total_visitors || 0;
    const totalDifference = Math.abs(region1Total - region2Total);
    const percentageDifference = Math.max(region1Total, region2Total) > 0 
      ? (totalDifference / Math.max(region1Total, region2Total) * 100) 
      : 0;

    const leadingRegion = region1Total > region2Total ? region1 : region2;
    const leadingTotal = Math.max(region1Total, region2Total);

    const insights = {
      title: 'Regional Performance Comparison',
      subtitle: `Comparative analysis of ${region1} vs ${region2} tourism metrics`,
      recommendation: percentageDifference > 20 
        ? `${leadingRegion} outperforms significantly with ${(leadingTotal / 1000).toFixed(0)}K visitors (+${percentageDifference.toFixed(0)}% advantage)`
        : percentageDifference > 5
        ? `Moderate performance gap: ${leadingRegion} leads by ${percentageDifference.toFixed(0)}%`
        : 'Both regions show similar tourism performance levels'
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
      insights: { title: 'Comparison Analysis Error', subtitle: 'Unable to process comparison data', recommendation: 'Please verify region selection and try again' } 
    };
  }
}