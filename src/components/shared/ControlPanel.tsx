import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Chip, 
  Button, 
  Divider,
  useTheme 
} from '@mui/material';
import { 
  Compare, 
  Visibility, 
  Clear, 
  CalendarToday, 
  BarChart,
  Timeline
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setComparisonMode, clearAllSelections, setViewMode } from '../../store/slices/statsSlice';

const ControlPanel = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { 
    isComparisonMode, 
    selectedRegionIds, 
    comparisonRegions, 
    viewMode, 
    selectedYear 
  } = useAppSelector((state) => state.stats);

  const handleComparisonToggle = () => {
    dispatch(setComparisonMode(!isComparisonMode));
  };

  const handleClearSelections = () => {
    dispatch(clearAllSelections());
  };

  const handleViewModeChange = (mode: 'yearly' | 'monthly') => {
    dispatch(setViewMode(mode));
  };

  const getSelectionStatus = () => {
    if (isComparisonMode) {
      const { region1, region2 } = comparisonRegions;
      if (region1 && region2) {
        return { count: 2, status: 'complete', regions: [region1, region2] };
      }
      if (region1 || region2) {
        return { count: 1, status: 'partial', regions: [region1 || region2] };
      }
      return { count: 0, status: 'empty', regions: [] };
    }
    return { 
      count: selectedRegionIds.length, 
      status: selectedRegionIds.length > 0 ? 'selected' : 'none', 
      regions: selectedRegionIds 
    };
  };

  const selectionStatus = getSelectionStatus();

  return (
    <Paper 
      sx={{ 
        p: 2.5, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3px',
          height: '100%',
          background: theme.charts.primaryGradient,
        }
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: '1.1rem',
            mb: 0.5,
          }}
        >
          Control Panel
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          Configure analysis settings
        </Typography>
      </Box>

      {/* View Mode Toggle */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CalendarToday sx={{ fontSize: 16 }} />
          Time View
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'yearly' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<BarChart sx={{ fontSize: 16 }} />}
            onClick={() => handleViewModeChange('yearly')}
            sx={{
              flex: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 1.5,
              textTransform: 'none',
              ...(viewMode === 'yearly' && {
                background: theme.charts.primaryGradient,
                boxShadow: `0 2px 8px ${theme.charts.primary}30`,
              })
            }}
          >
            Yearly
          </Button>
          <Button
            variant={viewMode === 'monthly' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<Timeline sx={{ fontSize: 16 }} />}
            onClick={() => handleViewModeChange('monthly')}
            sx={{
              flex: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 1.5,
              textTransform: 'none',
              ...(viewMode === 'monthly' && {
                background: theme.charts.primaryGradient,
                boxShadow: `0 2px 8px ${theme.charts.primary}30`,
              })
            }}
          >
            Monthly
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Comparison Mode */}
      <Box sx={{ mb: 2.5 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isComparisonMode}
              onChange={handleComparisonToggle}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Comparison Mode
              </Typography>
            </Box>
          }
          sx={{ 
            m: 0,
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem',
            }
          }}
        />
        
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            mt: 0.5,
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
            fontStyle: 'italic',
          }}
        >
          {isComparisonMode ? 'Select 2 regions to compare' : 'Compare multiple regions side by side'}
        </Typography>
      </Box>

      {/* Selection Status */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Visibility sx={{ fontSize: 16 }} />
          Current Selection
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={`${selectionStatus.count} region${selectionStatus.count === 1 ? '' : 's'}`}
            size="small"
            color={selectionStatus.count > 0 ? 'primary' : 'default'}
            sx={{
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 28,
              ...(selectionStatus.count > 0 && {
                backgroundColor: `${theme.palette.primary.main}15`,
                color: theme.palette.primary.dark,
              })
            }}
          />
          
          {isComparisonMode && (
            <Chip
              label={
                selectionStatus.status === 'complete' ? 'Ready' :
                selectionStatus.status === 'partial' ? 'Select 1 more' : 'Select 2 regions'
              }
              size="small"
              color={
                selectionStatus.status === 'complete' ? 'success' :
                selectionStatus.status === 'partial' ? 'warning' : 'default'
              }
              sx={{ 
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 28,
              }}
            />
          )}
        </Box>

        {selectionStatus.regions.length > 0 && (
          <Box sx={{ mb: 1 }}>
            {selectionStatus.regions.slice(0, 3).map((region, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  pl: 1,
                  '&::before': {
                    content: '"•"',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    marginRight: '8px',
                  }
                }}
              >
                {region}
              </Typography>
            ))}
            {selectionStatus.regions.length > 3 && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: theme.palette.text.disabled,
                  fontSize: '0.75rem',
                  pl: 1,
                  fontStyle: 'italic',
                }}
              >
                +{selectionStatus.regions.length - 3} more...
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Clear sx={{ fontSize: 16 }} />}
          onClick={handleClearSelections}
          disabled={selectionStatus.count === 0}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 1.5,
            textTransform: 'none',
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              backgroundColor: `${theme.palette.error.main}08`,
            },
            '&:disabled': {
              opacity: 0.5,
            }
          }}
        >
          Clear All Selections
        </Button>
      </Box>

      {/* Current Year Indicator */}
      <Box sx={{ 
        mt: 2, 
        p: 1.5, 
        borderRadius: 1.5,
        backgroundColor: `${theme.palette.info.main}08`,
        border: `1px solid ${theme.palette.info.light}`,
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            color: theme.palette.info.dark,
            fontSize: '0.75rem',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Analyzing Year: {selectedYear}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ControlPanel;