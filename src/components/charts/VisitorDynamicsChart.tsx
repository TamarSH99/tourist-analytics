import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid, Area, AreaChart } from 'recharts';
import { useAggregation } from '../../hooks/useAggregation';
import { useAppSelector } from '../../store/hooks';
import { Paper, Box, useTheme } from '@mui/material';
import InsightsPanel from '../shared/InsightsPanel';
import CustomTooltip from '../shared/CustomTooltip';

const VisitorDynamicsChart = () => {
  const theme = useTheme();
  const { visitorData, insights, comparisonData } = useAggregation();
  const { viewMode, isComparisonMode } = useAppSelector(state => state.stats);

  const formatVisitorValue = (value: number) => {
    if (viewMode === 'yearly') {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        height: 400, 
        display: 'flex', 
        flexDirection: 'column',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: 'none',
        margin: 0
      }}
    >
      <InsightsPanel 
        title={insights.title}
        subtitle={insights.subtitle}
        recommendation={insights.recommendation}
      />

      <Box sx={{ flex: 1, minHeight: 200, width: '100%', mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'monthly' ? (
            <AreaChart 
              data={visitorData}
              margin={{ top: 0, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="primaryAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.charts.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.charts.primary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="secondaryAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.charts.secondary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.charts.secondary} stopOpacity={0.1}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke={theme.charts.grid}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="name" 
                tick={{ 
                  fontSize: 12, 
                  fill: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
                axisLine={{ stroke: theme.charts.axis, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.grey[300] }}
              />
              
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
                tickFormatter={formatVisitorValue}
                axisLine={{ stroke: theme.charts.axis, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.grey[300] }}
              />
              
              <Tooltip 
                content={<CustomTooltip formatValue={formatVisitorValue} variant="detailed" />} 
              />
              
              {isComparisonMode && comparisonData ? (
                <>
                  <Area
                    type="monotone"
                    dataKey={comparisonData.region1}
                    stroke={theme.charts.primary}
                    strokeWidth={3}
                    fill="url(#primaryAreaGradient)"
                    name={comparisonData.region1}
                    dot={{ 
                      fill: theme.charts.primary, 
                      strokeWidth: 1, 
                      r: 3,
                      stroke: theme.palette.background.paper,
                      filter: "url(#glow)"
                    }}
                    activeDot={{ 
                      r: 5, 
                      fill: theme.charts.primary,
                      stroke: theme.palette.background.paper,
                      strokeWidth: 3,
                      filter: "url(#glow)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={comparisonData.region2}
                    stroke={theme.charts.secondary}
                    strokeWidth={3}
                    fill="url(#secondaryAreaGradient)"
                    name={comparisonData.region2}
                    dot={{ 
                      fill: theme.charts.secondary, 
                      strokeWidth: 1, 
                      r: 3,
                      stroke: theme.palette.background.paper,
                      filter: "url(#glow)"
                    }}
                    activeDot={{ 
                      r: 5, 
                      fill: theme.charts.secondary,
                      stroke: theme.palette.background.paper,
                      strokeWidth: 3,
                      filter: "url(#glow)"
                    }}
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
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke={theme.charts.primary}
                  strokeWidth={3}
                  fill="url(#primaryAreaGradient)"
                  dot={{ 
                    fill: theme.charts.primary, 
                    strokeWidth: 1, 
                    r: 3,
                    stroke: theme.palette.background.paper,
                    filter: "url(#glow)"
                  }}
                  activeDot={{ 
                    r: 5, 
                    fill: theme.charts.primary,
                    stroke: theme.palette.background.paper,
                    strokeWidth: 3,
                    filter: "url(#glow)"
                  }}
                />
              )}
            </AreaChart>
          ) : (
            <BarChart 
              data={visitorData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="blueBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.charts.primary} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={theme.charts.primary} stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="redBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.charts.secondary} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={theme.charts.secondary} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke={theme.charts.grid}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="name" 
                tick={{ 
                  fontSize: 12, 
                  fill: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
                axisLine={{ stroke: theme.charts.axis, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.grey[300] }}
              />
              
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
                tickFormatter={formatVisitorValue}
                axisLine={{ stroke: theme.charts.axis, strokeWidth: 1 }}
                tickLine={{ stroke: theme.palette.grey[300] }}
              />
              
              <Tooltip 
                content={<CustomTooltip formatValue={formatVisitorValue} variant="detailed" />} 
              />
              
              {isComparisonMode && comparisonData ? (
                <>
                  <Bar 
                    dataKey={comparisonData.region1} 
                    fill="url(#blueBarGradient)"
                    name={comparisonData.region1}
                    radius={[6, 6, 0, 0]}
                    stroke={theme.charts.primary}
                    strokeWidth={1}
                  />
                  <Bar 
                    dataKey={comparisonData.region2} 
                    fill="url(#redBarGradient)"
                    name={comparisonData.region2}
                    radius={[6, 6, 0, 0]}
                    stroke={theme.charts.secondary}
                    strokeWidth={1}
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
                <Bar 
                  dataKey="visitors" 
                  fill="url(#blueBarGradient)"
                  radius={[6, 6, 0, 0]}
                  stroke={theme.charts.primary}
                  strokeWidth={1}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default VisitorDynamicsChart;