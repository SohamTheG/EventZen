import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import PersonIcon from '@mui/icons-material/Person';
import FestivalIcon from '@mui/icons-material/Festival';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CelebrationIcon from '@mui/icons-material/Celebration';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon /> },
  { text: 'Calendar', icon: <CalendarMonthIcon /> },
  { text: 'Events', icon: <CelebrationIcon /> },
  // { text: 'Attendees', icon: <PeopleRoundedIcon /> },
  { text: 'Venues', icon: <FestivalIcon /> },
  // { text: 'Vendors', icon: <StorefrontIcon /> },
  { text: 'My Bookings', icon: <AssignmentRoundedIcon /> },
];

// const secondaryListItems = [
//   { text: 'Settings', icon: <SettingsRoundedIcon /> },
//   { text: 'About', icon: <InfoRoundedIcon /> },
//   { text: 'Feedback', icon: <HelpRoundedIcon /> },
// ];
// Update your component to accept a 'setSelectedView' prop

export default function MenuContent({ setSelectedView, currentView }) {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (user?.id) {
      apiClient.get(`/api/bookings/customer/${user.id}`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            setIsHost(true);
          }
        })
        .catch(err => console.error("Could not fetch host status:", err));
    }
  }, [user?.id]);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'center' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} sx={{ display: 'block' }}>
            <ListItemButton
              selected={currentView === item.text.toLowerCase()}
              onClick={() => setSelectedView(item.text.toLowerCase())}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {isHost && (
          <ListItem sx={{ display: 'block' }}>
            <ListItemButton
              selected={currentView === 'manage attendees'}
              onClick={() => setSelectedView('manage attendees')}
            >
              <ListItemIcon><PeopleRoundedIcon /></ListItemIcon>
              <ListItemText primary="Manage Attendees" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Stack>
  );
}