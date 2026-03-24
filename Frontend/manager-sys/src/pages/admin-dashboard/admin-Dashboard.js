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

import VenueManagement from './components/VenueManagement'; // We will create this
import VendorManagement from './components/VendorManagement'; // We will create this
import BookingApproval from './components/BookingApproval';
import AttendeeManagement from './components/AttendeeManagement';
import UserManagement from './components/UserManagement';
import ProfileManagement from './components/ProfileManagement';
import AdminDashboardComp from './components/AdminDashboardComp';

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
      case 'venues':
        return <VenueManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'event bookings':
        return <BookingApproval />;
      case 'attendees':
        return <AttendeeManagement />
      case 'users':
        return <UserManagement />
      case 'profile':
        return <ProfileManagement />
      case 'dashboard':
        return <AdminDashboardComp setSelectedView={setSelectedView} />;
      default:
        return <AdminDashboardComp setSelectedView={setSelectedView} />; // Default dashboard charts/stats
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
