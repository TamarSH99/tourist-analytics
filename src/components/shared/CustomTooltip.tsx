import React from 'react';
import { Paper, Box, useTheme } from '@mui/material';

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  formatValue?: (value: number) => string;
  showColorIndicator?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  formatValue = (value) => new Intl.NumberFormat().format(value),
  showColorIndicator = true,
  variant = 'default'
}) => {
  const theme = useTheme();

  if (!active || !payload || !payload.length) {
    return null;
  }

  const getFormattedLabel = () => {
    if (variant === 'compact') return label;
    return label;
  };

  const getFormattedValue = (entry: TooltipEntry) => {
    const formattedValue = formatValue(entry.value);
    
    switch (variant) {
      case 'compact':
        return `${formattedValue}`;
      case 'detailed':
        return `${entry.name}: ${formattedValue} visitors`;
      default:
        return `${entry.name}: ${formattedValue} visitors`;
    }
  };

  return (
    <Paper
      sx={{
        p: variant === 'compact' ? 1.5 : 2,
        background: theme.charts.tooltip.background,
        backdropFilter: 'blur(12px)',
        border: theme.charts.tooltip.border,
        borderRadius: variant === 'compact' ? 1 : 2,
        boxShadow: theme.charts.tooltip.shadow,
        minWidth: variant === 'compact' ? 'auto' : 180,
        maxWidth: 300,
      }}
    >
      {/* Label */}
      <Box sx={{ 
        fontSize: variant === 'compact' ? '12px' : '14px', 
        fontWeight: 600, 
        color: theme.palette.text.primary, 
        mb: variant === 'compact' ? 0.5 : 1 
      }}>
        {getFormattedLabel()}
      </Box>

      {/* Payload entries */}
      {payload.map((entry, index) => (
        <Box
          key={index}
          sx={{
            fontSize: variant === 'compact' ? '11px' : '13px',
            color: entry.color,
            display: 'flex',
            alignItems: 'center',
            gap: showColorIndicator ? 1 : 0,
            mb: variant === 'compact' ? 0.25 : 0.5,
            '&:last-child': { mb: 0 }
          }}
        >
          {/* Color indicator */}
          {showColorIndicator && (
            <Box
              sx={{
                width: variant === 'compact' ? 8 : 10,
                height: variant === 'compact' ? 8 : 10,
                borderRadius: '50%',
                backgroundColor: entry.color,
                boxShadow: `0 0 ${variant === 'compact' ? '4px' : '8px'} ${entry.color}40`,
                flexShrink: 0,
              }}
            />
          )}
          
          {/* Value text */}
          <Box sx={{ 
            fontWeight: 500,
            color: variant === 'compact' ? entry.color : theme.palette.text.primary,
          }}>
            {getFormattedValue(entry)}
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default CustomTooltip;