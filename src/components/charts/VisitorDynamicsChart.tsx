import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useAggregation } from '../../hooks/useAggregation';
import { useAppSelector } from '../../store/hooks';
import { Paper, Typography, Box } from '@mui/material';

const VisitorDynamicsChart = () => {
  const { visitorData, insights, comparisonData } = useAggregation();
  const { viewMode, isComparisonMode } = useAppSelector(state => state.stats);

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5">{insights.title}</Typography>
      <Typography variant="h6">{insights.subtitle}</Typography>
      <Typography variant="body2">{insights.recommendation}</Typography>

      <Box sx={{ flex: 1, minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'monthly' ? (
            <LineChart data={visitorData}>
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [new Intl.NumberFormat().format(value), 'Visitors']} />
              
              {isComparisonMode && comparisonData ? (
                <>
                  <Line dataKey={comparisonData.region1} stroke="blue" strokeWidth={2} name={comparisonData.region1} />
                  <Line dataKey={comparisonData.region2} stroke="red" strokeWidth={2} name={comparisonData.region2} />
                  <Legend />
                </>
              ) : (
                <Line dataKey="visitors" stroke="blue" strokeWidth={2} />
              )}
            </LineChart>
          ) : (
            <BarChart data={visitorData}>
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => [new Intl.NumberFormat().format(value), 'Visitors']} />
              
              {isComparisonMode && comparisonData ? (
                <>
                  <Bar dataKey={comparisonData.region1} fill="blue" name={comparisonData.region1} />
                  <Bar dataKey={comparisonData.region2} fill="red" name={comparisonData.region2} />
                  <Legend />
                </>
              ) : (
                <Bar dataKey="visitors" fill="blue" />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default VisitorDynamicsChart;