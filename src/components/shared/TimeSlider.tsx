import React, { useState, useEffect } from 'react';
import { Box, Button, Slider, Typography, Paper, useTheme } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setYear, setMonth } from '../../store/slices/statsSlice';

const TimeSlider = () => {
  const theme = useTheme();
  const { selectedYear, selectedMonth, viewMode } = useAppSelector(state => state.stats);
  const dispatch = useAppDispatch();
  
  const [isPlaying, setIsPlaying] = useState(false);

  // Define ranges based on view mode
  const yearRange = [2020, 2021, 2022, 2023, 2024];
  const monthRange = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isYearlyMode = viewMode === 'yearly';
  const range = isYearlyMode ? yearRange : monthRange;
  const min = Math.min(...range);
  const max = Math.max(...range);
  
  // Get current value from Redux state
  const currentValue = isYearlyMode ? selectedYear : (selectedMonth || 1);

  // Stop playing when view mode changes
  useEffect(() => {
    setIsPlaying(false);
  }, [viewMode]);

  // Auto-play functionality
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      interval = setInterval(() => {
        const nextValue = currentValue + 1;
        
        if (nextValue > max) {
          setIsPlaying(false);
          return;
        }
        
        if (isYearlyMode) {
          dispatch(setYear(nextValue));
        } else {
          dispatch(setMonth(nextValue));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentValue, max, isYearlyMode, dispatch]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setIsPlaying(false);
    
    if (isYearlyMode) {
      dispatch(setYear(value));
    } else {
      dispatch(setMonth(value));
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (isYearlyMode) {
      dispatch(setYear(min));
    } else {
      dispatch(setMonth(min));
    }
  };

  const formatValue = (value: number) => {
    return isYearlyMode ? value.toString() : monthNames[value - 1];
  };

  const canPlay = currentValue < max;

  return (
    <Paper 
      sx={{ 
        p: 2,
        height: '60%', 
        display: 'flex', 
        alignItems: 'center',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        gap: 3,
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
      {/* Current Value Display - Compact */}
      <Box sx={{ 
        textAlign: 'center', 
        minWidth: '100px',
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontSize: '1.5rem',
            lineHeight: 1,
          }}
        >
          {formatValue(currentValue)}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
          }}
        >
          {isYearlyMode ? 'Year' : 'Month'}
        </Typography>
      </Box>

      {/* Controls - Compact */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant={isPlaying ? "contained" : "outlined"}
          onClick={handlePlayPause}
          disabled={!canPlay && !isPlaying}
          size="small"
          sx={{
            minWidth: '80px',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 1,
            textTransform: 'none',
            height: 32,
            ...(isPlaying && {
              background: theme.charts.primaryGradient,
              boxShadow: `0 2px 8px ${theme.charts.primary}30`,
            })
          }}
        >
          {isPlaying ? <Pause sx={{ fontSize: 16 }} /> : <PlayArrow sx={{ fontSize: 16 }} />}
          {isPlaying ? 'Pause' : canPlay ? 'Play' : 'End'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={currentValue === min}
          size="small"
          sx={{
            minWidth: '70px',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 1,
            textTransform: 'none',
            height: 32,
          }}
        >
          <Replay sx={{ fontSize: 14, mr: 0.5 }} />
          Reset
        </Button>
      </Box>

      {/* Slider - Takes remaining space */}
      <Box sx={{ flex: 1, px: 2 }}>
        <Slider
          value={currentValue}
          min={min}
          max={max}
          step={1}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatValue}
          sx={{
            color: theme.palette.primary.main,
            height: 6,
            '& .MuiSlider-track': {
              background: theme.charts.primaryGradient,
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              height: 16,
              width: 16,
              backgroundColor: theme.palette.primary.main,
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
            },
            '& .MuiSlider-valueLabel': {
              fontSize: '10px',
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
            }
          }}
        />
        
        {/* Range labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: theme.palette.text.disabled }}>
            {formatValue(min)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: theme.palette.text.disabled }}>
            {formatValue(max)}
          </Typography>
        </Box>
      </Box>

      {/* Status indicator - Compact */}
      {isPlaying && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          minWidth: '80px',
        }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.primary.main,
              fontSize: '0.7rem',
              fontWeight: 500,
            }}
          >
            Playing
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TimeSlider;