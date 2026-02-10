import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useAggregation } from '../../hooks/useAggregation';
import { useAppSelector } from '../../store/hooks';
import { Paper, Typography, Box } from '@mui/material';

const MarketSegmentationChart = () => {
  const { continentsData, comparisonData } = useAggregation();
  const { selectedRegionIds, selectedYear, viewMode, isComparisonMode } = useAppSelector(state => state.stats);


  const getTitle = () => {
    if (isComparisonMode && comparisonData) {
      return `Visitor Origins Comparison: ${comparisonData.region1} vs ${comparisonData.region2}`;
    }
    
    const regionText = selectedRegionIds.length > 0
      ? `Selected Regions (${selectedRegionIds.length})`
      : 'All Georgia';
    return `Visitor Origins - ${regionText}`;
  };

  const getSubtitle = () => {
    if (isComparisonMode && comparisonData) {
      return `Comparing market segmentation between regions for ${selectedYear}`;
    }

    if (isComparisonMode) {
      return 'Select two regions to compare market segmentation';
    }

    if (!continentsData || continentsData.length === 0) {
      return 'No data available';
    }

    console.log('Continents Data:', continentsData); // Debug log to check data structure
    const topMarket = continentsData.reduce((max, continent) => {
      const maxValue = max.value || 0;
      const continentValue = continent.value || 0;
      return continentValue > maxValue ? continent : max;
    }, { name: '', value: 0 });

    const totalVisitors = continentsData.reduce((sum, continent) => sum + (continent.value || 0), 0);
    const topMarketPercentage = totalVisitors > 0 ? ((topMarket.value || 0) / totalVisitors * 100) : 0;
    
    return topMarket.name ? `${topMarket.name} leads with ${topMarketPercentage.toFixed(0)}% market share` : 'No data available';
  };

  // Safety check for empty data
  if (!continentsData || continentsData.length === 0) {
    return (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5">Market Segmentation</Typography>
        <Typography variant="h6">No data available</Typography>
        <Typography variant="body2" color="gray">
          {isComparisonMode ? 'Select two regions to compare' : 'Select regions or view all Georgia'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography >{getTitle()}</Typography>
      <Typography >{getSubtitle()}</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {viewMode === 'yearly' ? 'Multi-year' : 'Monthly'} view | {isComparisonMode ? 'Comparison Mode' : 'Normal Mode'}
        </Typography>
        
        {/* Show data source note - always shows which year's data is being used */}
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'info.main', mt: 1 }}>
          Showing continent data for year: <strong>{selectedYear}</strong>
          {viewMode === 'monthly' && (
            <span> (continent breakdowns are yearly totals only)</span>
          )}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            data={continentsData}
            key={`${selectedYear}-${selectedRegionIds.join('-')}-${isComparisonMode}`} // Force re-render when year changes
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 14 }} />
            <PolarRadiusAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            
            {isComparisonMode && comparisonData ? (
              <>
                <Radar
                  name={comparisonData.region1}
                  dataKey={comparisonData.region1}
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name={comparisonData.region2}
                  dataKey={comparisonData.region2}
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </>
            ) : (
              <Radar
                name="Visitors"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MarketSegmentationChart;