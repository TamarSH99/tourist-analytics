import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut, Layers } from '@mui/icons-material';
import { useMap } from 'react-leaflet';

interface MapControlsProps {
  onLayerChange?: () => void;
}

const MapLegend = () => (
  <Paper sx={{ p: 1, mb: 2, opacity: 0.9 }}>
    <Typography variant="caption" fontWeight="bold" display="block">
      Legend
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
      <Box sx={{ 
        width: 12, 
        height: 12, 
        bgcolor: 'blue', 
        mr: 1, 
        borderRadius: '2px' 
      }} />
      <Typography variant="caption">Selected</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        width: 12, 
        height: 12, 
        bgcolor: 'white', 
        border: '1px solid white', 
        mr: 1, 
        borderRadius: '2px' 
      }} />
      <Typography variant="caption">Available</Typography>
    </Box>
  </Paper>
);

const ZoomControls = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <Paper sx={{ p: 0.5, mb: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Tooltip title="Zoom In" placement="left">
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomIn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOut fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export const MapControls: React.FC<MapControlsProps> = ({ onLayerChange }) => {
  return (
    <Box sx={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      bottom: 20,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }}>
      <ZoomControls />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <MapLegend />
      {onLayerChange && (
        <Paper sx={{ p: 0.5 }}>
        <Tooltip title="Change Layer" placement="left">
          <IconButton size="small" onClick={onLayerChange}>
          <Layers fontSize="small" />
          </IconButton>
        </Tooltip>
        </Paper>
      )}
      </Box>
    </Box>
  );
};

export default MapControls;