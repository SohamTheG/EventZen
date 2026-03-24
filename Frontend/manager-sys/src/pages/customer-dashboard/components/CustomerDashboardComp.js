import React, { useState, useEffect } from 'react';
import {
    Grid, Paper, Typography, Box, Button, Stack,
    Avatar, Divider, Card, CardContent
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// We receive setSelectedView as a prop from Dashboard.js
export default function CustomerDashboard({ setSelectedView }) {
    const [stats, setStats] = useState({ events: 0, vendors: 0, venues: 0, myAttending: 0 });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Ports 9001 (Venues/Vendors)
                const vRes = await fetch('http://localhost:9001/api/venues');
                const venRes = await fetch('http://localhost:9001/api/vendors');
                const venues = await vRes.json();
                const vendors = await venRes.json();

                // 2. Port 9002 (Bookings/Events)
                const bRes = await fetch('http://localhost:9002/api/bookings');
                const events = await bRes.json();
                const approvedEvents = events.filter(e => e.status === 'APPROVED');

                // 3. Port 9000 (Attendees)
                const aRes = await fetch('http://localhost:9000/api/attendees/all');
                const attendees = await aRes.json();
                const myCount = attendees.filter(a => a.user?.id === user?.id).length;

                setStats({
                    venues: venues.length,
                    vendors: vendors.length,
                    events: approvedEvents.length,
                    myAttending: myCount
                });
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            }
        };
        fetchDashboardData();
    }, [user?.id]);

    const StatCard = ({ title, value, icon, color }) => (
        <Paper elevation={0} sx={{
            p: 3, borderRadius: 4, bgcolor: `${color}.main`, color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
            <Box>
                <Typography variant="h3" fontWeight="bold">{value}</Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>{title}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                {icon}
            </Avatar>
        </Paper>
    );

    return (
        <Box sx={{ p: 4, width: '100%' }}>
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Welcome, {user?.name}!</Typography>
                    <Typography color="text.secondary">Ready to discover your next big event?</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<RocketLaunchIcon />}
                    // Switches view to 'events' instead of routing
                    onClick={() => setSelectedView('events')}
                    sx={{ borderRadius: 3, px: 3, py: 1.5, fontWeight: 'bold' }}
                >
                    Browse Events
                </Button>
            </Stack>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Venues" value={stats.venues} icon={<LocationCityIcon />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="My Events " value={stats.myAttending} icon={<CheckCircleIcon />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Vendors" value={stats.vendors} icon={<StorefrontIcon />} color="secondary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Public Events" value={stats.events} icon={<EventIcon />} color="warning" />
                </Grid>
            </Grid>

            {/* Navigation & Help Section */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Quick Actions</Typography>
                    <Stack spacing={2}>
                        {[
                            { label: 'Explore Venues', view: 'venues', desc: 'Browse curated spaces for any occasion.' },
                            { label: 'My Bookings', view: 'my bookings', desc: 'Review the events you are attending.' }
                        ].map((item, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    p: 2.5, borderRadius: 3, cursor: 'pointer', border: '1px solid transparent',
                                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.light' },
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    transition: '0.2s'
                                }}
                                onClick={() => setSelectedView(item.view)}
                            >
                                <Box>
                                    <Typography fontWeight="bold">{item.label}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                </Box>
                                <ArrowForwardIosIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            </Paper>
                        ))}
                    </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 4, height: '100%', bgcolor: 'grey.50', border: 'none' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Need Assistance?</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Our support team is available 24/7 to help you coordinate with vendors or finalize venue bookings.
                            </Typography>
                            <Button fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}