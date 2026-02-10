import React from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import theme from './theme/theme';
import RegionMap from './components/map/RegionMap';
import VisitorDynamicsChart from './components/charts/VisitorDynamicsChart';
import MarketSegmentationChart from './components/charts/MarketSegmentationChart';
import ControlPanel from './components/shared/ControlPanel';
import AppHeader from './components/shared/AppHeader';
import TimeSlider from './components/shared/TimeSlider';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          overflow: 'hidden',
        }}
      >
        {/* Header - Fixed at top */}
        <AppHeader />

        {/* Main Content - Three Column Layout */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '280px 1fr 500px', // Left panel | Center | Right panel
            gridTemplateRows: '1fr auto', // Main content | Time slider row
            gap: 2,
            p: 2,
            overflow: 'hidden',
            gridTemplateAreas: `
                "controls map charts"
                "controls time charts"
              `
          }}
        >
          {/* Left Side - Control Panel (Full Height) */}
          <Box
            sx={{
              gridArea: 'controls',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ControlPanel />
          </Box>

          {/* Center Top - Map */}
          <Box
            sx={{
              gridArea: 'map',
              minHeight: 0,
            }}
          >
            <RegionMap />
          </Box>

          {/* Center Bottom - Time Slider */}
          <Box
            sx={{
              gridArea: 'time',
              height: '120px',
            }}
          >
            <TimeSlider />
          </Box>

          {/* Right Side - Charts (Full Height) */}
          <Box
            sx={{
              gridArea: 'charts',
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >

            {/* Top Chart */}
            <VisitorDynamicsChart />
            {/* Bottom Chart */}
            <MarketSegmentationChart />

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;