import React from 'react';
import { Paper, Typography, Box, Divider, useTheme } from '@mui/material';
import { TrendingUp, Info, Lightbulb } from '@mui/icons-material';

interface InsightsPanelProps {
  title: string;
  subtitle: string;
  recommendation?: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ title, subtitle, recommendation }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, // Reduced from 3
        mb: 1.5, // Reduced from 2
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3px', // Reduced from 4px
          height: '100%',
          background: theme.charts.primaryGradient,
        }
      }}
    >
      {/* Title Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}> {/* Reduced from mb: 2 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32, // Reduced from 40
            height: 32, // Reduced from 40
            borderRadius: '50%',
            background: theme.charts.primaryGradient,
            mr: 1.5, // Reduced from 2
            boxShadow: `0 3px 10px ${theme.charts.primary}30`, // Reduced shadow
          }}
        >
          <TrendingUp sx={{ color: 'white', fontSize: 18 }} /> {/* Reduced from 20 */}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: '1.1rem', // Reduced from 1.25rem
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Subtitle Section */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}> {/* Reduced from mb: 2 */}
        <Info 
          sx={{ 
            color: theme.palette.text.secondary, 
            fontSize: 16, // Reduced from 18
            mr: 1, // Reduced from 1.5
            mt: 0.1,
            flexShrink: 0 
          }} 
        />
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: '0.95rem', // Reduced from 1.1rem
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {/* Divider */}
      {recommendation && <Divider sx={{ my: 1.5, borderColor: theme.palette.divider }} />} 
      {/* Recommendation Section */}
      {recommendation &&   <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20, // Reduced from 24
            height: 20, // Reduced from 24
            borderRadius: '50%',
            backgroundColor: theme.palette.warning.main,
            mr: 1, // Reduced from 1.5
            mt: 0.1,
            flexShrink: 0,
            boxShadow: `0 2px 6px ${theme.palette.warning.main}20`, // Reduced shadow
          }}
        >
          <Lightbulb sx={{ color: 'white', fontSize: 12 }} /> {/* Reduced from 14 */}
        </Box>
        
      <Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              fontWeight: 600,
              fontSize: '0.7rem', // Reduced from 0.75rem
              letterSpacing: '0.05em',
              display: 'block',
              mb: 0.25, // Reduced from 0.5
            }}
          >
            Key Insight
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontStyle: 'italic',
              lineHeight: 1.4, // Reduced from 1.5
              fontSize: '0.875rem', // Reduced from 1rem
            }}
          >
            {recommendation}
          </Typography>
        </Box>
      </Box>}
    </Paper>
  );
};

export default InsightsPanel;