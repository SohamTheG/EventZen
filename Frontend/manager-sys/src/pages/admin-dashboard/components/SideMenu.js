import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu({ setSelectedView, currentView, mobileOpen, handleDrawerToggle }) {
  // Get real admin data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: '' };

  // Extracted content so we can render it in both the Mobile and Desktop drawers
  const drawerContent = (
    <>
      {/* Mobile Close Button - Only visible on small screens */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <MenuContent
          currentView={currentView}
          setSelectedView={(view) => {
            setSelectedView(view);
            // Auto-close the mobile menu when a link is clicked
            if (mobileOpen) handleDrawerToggle();
          }}
        />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={user.name}
          src={`https://ui-avatars.com/api/?name=${user.name}&background=007FFF&color=fff`}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user.email}
          </Typography>
        </Box>
        <OptionsMenu setSelectedView={setSelectedView} />
      </Stack>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>

      {/* 1. MOBILE DRAWER (Temporary, slides in from the left) */}
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .${drawerClasses.paper}`]: { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </MuiDrawer>

      {/* 2. DESKTOP DRAWER (Permanent, always visible) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          [`& .${drawerClasses.paper}`]: { backgroundColor: 'background.paper' },
        }}
        open
      >
        {drawerContent}
      </Drawer>

    </Box>
  );
}