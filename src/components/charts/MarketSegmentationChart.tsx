import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAggregation } from '../../hooks/useAggregation';
import { useAppSelector } from '../../store/hooks';
import { Paper, Box, useTheme } from '@mui/material';
import InsightsPanel from '../shared/InsightsPanel';
import CustomTooltip from '../shared/CustomTooltip';

const MarketSegmentationChart = () => {
  const theme = useTheme();
  const { continentsData, comparisonData } = useAggregation();
  const { selectedRegionIds, selectedYear, viewMode, isComparisonMode } = useAppSelector(state => state.stats);

  // Create insights object similar to VisitorDynamicsChart
  const insights = (() => {
    if (isComparisonMode && comparisonData) {
      return {
        title: `Visitor Origins Comparison: ${comparisonData.region1} vs ${comparisonData.region2}`,
        subtitle: `Comparing market segmentation between regions for ${selectedYear}`,
      };
    }

    if (isComparisonMode) {
      return {
        title: 'Market Segmentation',
        subtitle: 'Select two regions to compare market segmentation',
      };
    }

    if (!continentsData || continentsData.length === 0) {
      return {
        title: 'Market Segmentation',
        subtitle: 'No data available',
      };
    }

    const regionText = selectedRegionIds.length > 0
      ? `Selected Regions (${selectedRegionIds.length})`
      : 'All Georgia';

    const topMarket = continentsData.reduce((max, continent) => {
      const maxValue = max.value || 0;
      const continentValue = continent.value || 0;
      return continentValue > maxValue ? continent : max;
    }, { name: '', value: 0 });

    const totalVisitors = continentsData.reduce((sum, continent) => sum + (continent.value || 0), 0);
    const topMarketPercentage = totalVisitors > 0 ? ((topMarket.value || 0) / totalVisitors * 100) : 0;

    return {
      title: `Visitor Origins - ${regionText}`,
      subtitle: topMarket.name
        ? `${topMarket.name} leads with ${topMarketPercentage.toFixed(0)}% market share`
        : 'No data available',    };
  })();

  // Format function for continent visitor counts
  const formatContinentValue = (value: number) => `${(value / 1000).toFixed(0)}K`;

  // Safety check for empty data
  if (!continentsData || continentsData.length === 0) {
    return (
      <Paper
        sx={{
          p: 2,
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          margin: 0
        }}
      >
        <InsightsPanel
          title={insights.title}
          subtitle={insights.subtitle}
        />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        height: 360,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: 'none',
      }}
    >
      <InsightsPanel
        title={insights.title}
        subtitle={insights.subtitle}
        recommendation={insights.recommendation}
      />

      <Box sx={{ flex: 1, minHeight: 250, mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={continentsData}
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
            // Removed the key prop to prevent complete redraws
          >
            <defs>
              <filter id="radarGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="primaryRadarGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.charts.primary} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={theme.charts.primary} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="secondaryRadarGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.charts.secondary} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={theme.charts.secondary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>

            <PolarGrid
              stroke={theme.charts.grid}
            />

            <PolarAngleAxis
              dataKey="name"
              tick={{
                fontSize: 16,
                fill: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            />

            <PolarRadiusAxis
              tick={{
                fontSize: 12,
                fill: theme.palette.text.secondary,
                fontWeight: 500,
              }}
              tickFormatter={formatContinentValue}
              stroke={theme.charts.axis}
              strokeWidth={1}
            />

            <Tooltip
              content={<CustomTooltip formatValue={formatContinentValue} variant="compact" />}
            />

            {isComparisonMode && comparisonData ? (
              <>
                <Radar
                  name={comparisonData.region1}
                  dataKey={comparisonData.region1}
                  stroke={theme.charts.primary}
                  fill="url(#primaryRadarGradient)"
                  fillOpacity={0.4}
                  strokeWidth={3}
                  dot={{
                    fill: theme.charts.primary,
                    strokeWidth: 2,
                    r: 5,
                    stroke: theme.palette.background.paper,
                    filter: "url(#radarGlow)"
                  }}
                  // Add animation duration
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
                <Radar
                  name={comparisonData.region2}
                  dataKey={comparisonData.region2}
                  stroke={theme.charts.secondary}
                  fill="url(#secondaryRadarGradient)"
                  fillOpacity={0.4}
                  strokeWidth={3}
                  dot={{
                    fill: theme.charts.secondary,
                    strokeWidth: 2,
                    r: 5,
                    stroke: theme.palette.background.paper,
                    filter: "url(#radarGlow)"
                  }}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                />
              </>
            ) : (
              <Radar
                name="Visitors"
                dataKey="value"
                stroke={theme.charts.primary}
                fill={theme.charts.primary}
                fillOpacity={0.5}
                strokeWidth={3}
                dot={{
                  fill: theme.charts.primary,
                  strokeWidth: 2,
                  r: 5,
                  stroke: theme.palette.background.paper,
                  filter: "url(#radarGlow)"
                }}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MarketSegmentationChart;