import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Grid, Paper, Typography, Box, Button, Stack,
    Avatar, Divider, List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import AccountBalanceIcon from '@mui/material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Chip from '@mui/material/Chip'; // This works as a default import
export default function AdminDashboardComp({ setSelectedView }) {
    const [stats, setStats] = useState({ users: 0, pending: 0, totalBookings: 0, venues: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const admin = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                // 1. User Stats
                const uRes = await apiClient.get('/auth/all');
                const users = uRes.data;

                // 2. Booking Stats
                const bRes = await apiClient.get('/api/bookings');
                const bookings = bRes.data;
                const pending = bookings.filter(b => b.status === 'PENDING').length;

                // 3. Venue Stats
                const vRes = await apiClient.get('/api/venues');
                const venues = vRes.data;

                setStats({
                    users: users.length,
                    pending: pending,
                    totalBookings: bookings.length,
                    venues: venues.length
                });
                setRecentUsers(users.slice(-4).reverse()); // Get last 4 registered
            } catch (err) {
                console.error("Admin Dashboard Error:", err);
            }
        };
        fetchAdminStats();
    }, []);

    const AdminStatCard = ({ title, value, icon, color, subtext }) => (
        <Paper elevation={3} sx={{
            p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2,
            borderBottom: `4px solid ${color}`
        }}>
            <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 60, height: 60 }}>
                {icon}
            </Avatar>
            <Box>
                <Typography variant="h4" fontWeight="bold">{value}</Typography>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
                <Typography variant="caption" sx={{ color: color, fontWeight: 'bold' }}>{subtext}</Typography>
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ p: 4, width: '100%' }}>
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <AdminPanelSettingsIcon color="primary" />
                        <Typography variant="h4" fontWeight="bold">Admin Command Center</Typography>
                    </Stack>
                    <Typography color="text.secondary">System overview for <strong>{admin?.name}</strong></Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<PendingActionsIcon />}
                    onClick={() => setSelectedView('event bookings')}
                    sx={{ borderRadius: 3, fontWeight: 'bold' }}
                >
                    Review {stats.pending} Pending Requests
                </Button>
            </Stack>

            {/* Top Level Stats */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <AdminStatCard title="Total Users" value={stats.users} icon={<PeopleIcon />} color="#2196f3" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AdminStatCard title="Total Bookings" value={stats.totalBookings} icon={<ConfirmationNumberIcon />} color="#4caf50" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AdminStatCard title="Managed Venues" value={stats.venues} icon={<AccountBalanceIcon />} color="#ff9800" />
                </Grid>

            </Grid>

            <Grid container spacing={4}>
                {/* Recent Users List */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Recently Joined Users</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List>
                            {recentUsers.map((u, i) => (
                                <ListItem key={i} sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'secondary.light' }}>{u.name?.charAt(0) || u.email.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={u.name || u.email.split('@')[0]}
                                        secondary={u.email}
                                    />
                                    <Chip label={u.role} size="small" variant="outlined" />
                                </ListItem>
                            ))}
                        </List>
                        <Button fullWidth sx={{ mt: 1 }} onClick={() => setSelectedView('Users')}>View All Users</Button>
                    </Paper>
                </Grid>

                {/* System Shortcut Actions */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Management Shortcuts</Typography>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Manage Venues', view: 'venues', color: '#158de2', icon: '🏢' },
                            { label: 'Vendor Directory', view: 'vendors', color: '#3aac0a', icon: '🤝' },
                            { label: 'Attendee Masterlist', view: 'attendees', color: '#c9099c', icon: '📝' },
                            { label: 'System Settings', view: 'profile', color: '#df9115', icon: '⚙️' },
                        ].map((item, index) => (
                            <Grid item xs={6} key={index}>
                                <Paper
                                    onClick={() => setSelectedView(item.view)}
                                    sx={{
                                        p: 3, textAlign: 'center', cursor: 'pointer', borderRadius: 4,
                                        bgcolor: item.color, transition: '0.3s',
                                        '&:hover': { transform: 'scale(1.03)', boxShadow: 4 }
                                    }}
                                >
                                    <Typography variant="h4" sx={{ mb: 1 }}>{item.icon}</Typography>
                                    <Typography fontWeight="bold" variant="body2">{item.label}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}