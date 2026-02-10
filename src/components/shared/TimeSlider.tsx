import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Slider, Typography, Paper } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setYear, setMonth } from '../../store/slices/statsSlice';

const TimeSlider = () => {
  const { selectedYear, viewMode } = useAppSelector(state => state.stats);
  const dispatch = useAppDispatch();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentValue, setCurrentValue] = useState(selectedYear);

  // Define ranges based on view mode
  const yearRange = [2020, 2021, 2022, 2023, 2024];
  const monthRange = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isYearlyMode = viewMode === 'yearly';
  const range = isYearlyMode ? yearRange : monthRange;
  const min = Math.min(...range);
  const max = Math.max(...range);

  // Update currentValue when view mode changes
  useEffect(() => {
    if (isYearlyMode) {
      setCurrentValue(selectedYear);
    } else {
      setCurrentValue(1); // Start with January for monthly mode
    }
    setIsPlaying(false); // Stop playing when mode changes
  }, [viewMode]);

  // Auto-play functionality - STOP at the end
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentValue(prevValue => {
          const nextValue = prevValue + 1;
          
          if (nextValue > max) {
            // STOP when reaching the end
            setIsPlaying(false);
            return prevValue; // Don't change the value
          }
          
          // Dispatch the update
          if (isYearlyMode) {
            dispatch(setYear(nextValue));
          } else {
            dispatch(setMonth(nextValue));
          }
          
          return nextValue;
        });
      }, 1000); // Change every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, min, max, isYearlyMode, dispatch]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setCurrentValue(value);
    setIsPlaying(false); // Stop playing when manually changed
    
    // Dispatch immediately
    if (isYearlyMode) {
      dispatch(setYear(value));
    } else {
      dispatch(setMonth(value));
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatValue = (value: number) => {
    return isYearlyMode ? value.toString() : monthNames[value - 1];
  };

  // Check if we can still play (not at the end)
  const canPlay = currentValue < max;

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Time Control - {isYearlyMode ? 'Years' : 'Months'}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handlePlayPause}
          disabled={!canPlay && !isPlaying}
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
          sx={{ minWidth: 120 }}
        >
          {isPlaying ? 'Pause' : canPlay ? 'Play' : 'Restart'}
        </Button>

        {!canPlay && !isPlaying && (
          <Button
            variant="outlined"
            onClick={() => {
              const resetValue = min;
              setCurrentValue(resetValue);
              if (isYearlyMode) {
                dispatch(setYear(resetValue));
              } else {
                dispatch(setMonth(resetValue));
              }
            }}
            sx={{ minWidth: 80 }}
          >
            Reset
          </Button>
        )}

        <Box sx={{ flex: 1, mx: 2 }}>
          <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
            Current: <strong>{formatValue(currentValue)}</strong>
          </Typography>
          
          <Slider
            value={currentValue}
            min={min}
            max={max}
            step={1}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={formatValue}
            marks={range.map(value => ({
              value,
              label: formatValue(value)
            }))}
            sx={{
              '& .MuiSlider-mark': {
                backgroundColor: '#1976d2',
              },
              '& .MuiSlider-markLabel': {
                fontSize: '12px',
                transform: 'rotate(-45deg)',
                transformOrigin: 'center',
              }
            }}
          />
        </Box>

        <Box sx={{ minWidth: 80, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {formatValue(min)} - {formatValue(max)}
          </Typography>
        </Box>
      </Box>

      {isPlaying && (
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'primary.main' }}>
          ▶ Auto-playing through {isYearlyMode ? 'years' : 'months'}...
        </Typography>
      )}

      {!canPlay && !isPlaying && (
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'warning.main' }}>
          ⏹ Reached the end. Use Reset to start over.
        </Typography>
      )}
    </Paper>
  );
};

export default TimeSlider;