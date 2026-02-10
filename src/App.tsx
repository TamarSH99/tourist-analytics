import { Typography, Box, Paper, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Switch, FormGroup } from '@mui/material';
import RegionMap from './components/map/RegionMap';
import { useAppSelector, useAppDispatch } from './store/hooks';
import VisitorDynamicsChart from './components/charts/VisitorDynamicsChart';
import MarketSegmentationChart from './components/charts/MarketSegmentationChart';
import TimeSlider from './components/shared/TimeSlider';
import { clearAllSelections, setViewMode, setComparisonMode } from './store/slices/statsSlice';

function App() {
  const { selectedYear, viewMode, selectedRegionIds, isComparisonMode, comparisonRegions } = useAppSelector(state => state.stats);
  const dispatch = useAppDispatch();

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box height="8vh" display="flex" alignItems="center" px={2}>
        <Typography variant="h4">Tourism Analytics</Typography>
        
        {isComparisonMode && (
          <Box sx={{ ml: 4, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body1">
              Comparison Mode: {comparisonRegions.region1 || 'Region 1'} vs {comparisonRegions.region2 || 'Region 2'}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box display="flex" flex={1}>
        <Box width="50%" display="flex" flexDirection="column" gap={1}>
          <Box flex={1}>
            <VisitorDynamicsChart />
          </Box>
          <Box flex={1}>
            <MarketSegmentationChart />
          </Box>
        </Box>
        <Box flex={1}>
          <RegionMap />
        </Box>
      </Box>
      
      <Box height="30vh" display="flex" alignItems="center" px={4} gap={2} >
        <Paper sx={{ p: 2, flex: 1, height: '80%' }}>
          
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isComparisonMode}
                  onChange={(e) => dispatch(setComparisonMode(e.target.checked))}
                />
              }
              label="Comparison Mode"
            />
          </FormGroup>
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>View Mode:</FormLabel>
            <RadioGroup
              value={viewMode}
              onChange={(e) => dispatch(setViewMode(e.target.value as 'yearly' | 'monthly'))}
            >
              <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
            </RadioGroup>
          </FormControl>

          <Button 
            variant="outlined"
            onClick={() => dispatch(clearAllSelections())}
            fullWidth
          >
            Clear Regions
          </Button>

          {isComparisonMode ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Select 2 regions to compare
            </Typography>
          ) : (
            selectedRegionIds.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedRegionIds.length} regions selected
              </Typography>
            )
          )}
        </Paper>
               <Box flex={2}>
          <TimeSlider />
        </Box>
      </Box>
    </Box>
  );
}

export default App;