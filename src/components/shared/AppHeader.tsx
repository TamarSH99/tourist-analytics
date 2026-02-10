import React from 'react';
import { Box, Typography, Chip, useTheme, Container } from '@mui/material';
import { TrendingUp, Compare, Public } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

const AppHeader = () => {
  const theme = useTheme();
  const { isComparisonMode, selectedRegionIds, comparisonRegions } = useAppSelector((state) => state.stats);

  const getStatusInfo = () => {
    if (isComparisonMode) {
      const { region1, region2 } = comparisonRegions;
      if (region1 && region2) {
        return {
          label: `Comparing: ${region1} vs ${region2}`,
          color: 'success' as const,
          icon: <Compare sx={{ fontSize: 16 }} />
        };
      }
      return {
        label: 'Comparison Mode - Select 2 regions',
        color: 'warning' as const,
        icon: <Compare sx={{ fontSize: 16 }} />
      };
    }

    if (selectedRegionIds.length > 0) {
      return {
        label: `${selectedRegionIds.length} region${selectedRegionIds.length === 1 ? '' : 's'} selected`,
        color: 'primary' as const,
        icon: <Public sx={{ fontSize: 16 }} />
      };
    }

    return {
      label: 'All Georgia regions',
      color: 'default' as const,
      icon: <Public sx={{ fontSize: 16 }} />
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Box
      sx={{
        height: '8vh',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: theme.charts.primaryGradient,
        }
      }}
    >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'space-between',
            height: '100%',
            px: 2,
          }}
        >
          {/* Left section - Logo and title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                background: theme.charts.primaryGradient,
                boxShadow: `0 4px 12px ${theme.charts.primary}20`,
              }}
            >
              <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Tourism Analytics
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  mt: -0.5,
                }}
              >
                Georgia Tourism Data Visualization
              </Typography>
            </Box>
          </Box>

          {/* Right section - Status indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Current status chip */}
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              color={statusInfo.color}
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                height: 36,
                borderRadius: 2,
                '& .MuiChip-icon': {
                  marginLeft: 1,
                },
                ...(statusInfo.color === 'success' && {
                  backgroundColor: `${theme.palette.success.main}08`,
                  borderColor: theme.palette.success.main,
                  color: theme.palette.success.dark,
                }),
                ...(statusInfo.color === 'warning' && {
                  backgroundColor: `${theme.palette.warning.main}08`,
                  borderColor: theme.palette.warning.main,
                  color: theme.palette.warning.dark,
                }),
                ...(statusInfo.color === 'primary' && {
                  backgroundColor: `${theme.palette.primary.main}08`,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.dark,
                }),
              }}
            />

            {/* Mode indicator */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: isComparisonMode 
                  ? `${theme.palette.warning.main}10` 
                  : `${theme.palette.grey[100]}`,
                border: `1px solid ${isComparisonMode ? theme.palette.warning.light : theme.palette.grey[300]}`,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isComparisonMode 
                    ? theme.palette.warning.main 
                    : theme.palette.success.main,
                  boxShadow: `0 0 8px ${isComparisonMode ? theme.palette.warning.main : theme.palette.success.main}40`,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {isComparisonMode ? 'Compare' : 'Explore'}
              </Typography>
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default AppHeader;