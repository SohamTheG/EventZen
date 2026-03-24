import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from 'shared-theme/AppTheme';
import React, { useState } from 'react';

import VenueBrowser from './components/VenueBrowser';
import MyBookings from './components/MyBookings';
import PublicEvents from './components/PublicEvents';
import CustomerDashboardComp from './components/CustomerDashboardComp';
import ProfileManagement from './components/ProfileManagement';

// Inside CustomerDashboard Component



import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const [selectedView, setSelectedView] = useState('dashboard');

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return <CustomerDashboardComp setSelectedView={setSelectedView} />;
      case 'venues':
        return <VenueBrowser />;
      case 'my bookings':
        return <MyBookings />;
      case 'events':
        return <PublicEvents />;
      case 'profile':
        return <ProfileManagement />;
      default:
        // Fallback in case state is null or unexpected
        return <CustomerDashboardComp setSelectedView={setSelectedView} />;
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu setSelectedView={setSelectedView} currentView={selectedView} />
        {/* <AppNavbar /> */}
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {/* <MainGrid /> */}
            {renderContent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
