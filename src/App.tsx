import { Typography, Box, Paper } from '@mui/material';
import RegionMap from './components/map/RegionMap';
import { useAppSelector } from './store/hooks';

function App() {
  const { selectedYear } = useAppSelector(state => state.stats);

  return (
    <Box sx={{ 
      background: `radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.05) 0, transparent 50%), 
                   radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.05) 0, transparent 50%),
                   #f8fafc`, 
      height: '98vh', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden'
    }}>
      {/* Navbar Container */}
      <Box sx={{
        py: 2,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        zIndex: 1100
      }}>
        <Typography 
          variant="h6" 
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1e293b', // Slate 800
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box component="span" sx={{ color: '#3b82f6' }}>●</Box>
          Tourism Analytics
        </Typography>

        <Paper elevation={0} sx={{ 
          px: 2, py: 0.5, 
          borderRadius: '20px', 
          bgcolor: '#f1f5f9', 
          border: '1px solid #e2e8f0' 
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
            Year: {selectedYear}
          </Typography>
        </Paper>
      </Box>

      {/* Map Main View */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        position: 'relative'
      }}>
        <Box sx={{
          height: '100%',
          width: '100%',
          borderRadius: 4, 
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff'
        }}>
          <RegionMap />
        </Box>
     
      </Box>
      
    </Box>
  );
}

export default App;