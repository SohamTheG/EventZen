import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Grid, Paper, Typography, Box, Button, Stack,
    Avatar, Divider, Card, CardContent, CardMedia, CardActions, Chip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';

// We receive setSelectedView as a prop from Dashboard.js
export default function CustomerDashboard({ setSelectedView }) {
    const [dashboardData, setDashboardData] = useState({
        stats: { events: 0, vendors: 0, venues: 0, myAttending: 0 },
        topVenues: [],
        upcomingEvents: [],
        venueMap: {}
    });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Venues/Vendors
                const vRes = await apiClient.get('/api/venues');
                const venRes = await apiClient.get('/api/vendors');
                const venues = vRes.data;
                const vendors = venRes.data;

                const vMap = {};
                venues.forEach(v => vMap[v.id] = v);

                // 2. Fetch Bookings/Events
                const bRes = await apiClient.get('/api/bookings');
                const events = bRes.data;
                const approvedEvents = events.filter(e => e.status === 'APPROVED');

                // 3. Fetch Attendees
                const aRes = await apiClient.get('/api/attendees/all');
                const attendees = aRes.data;
                const myCount = attendees.filter(a => a.user?.id === user?.id).length;

                setDashboardData({
                    stats: {
                        venues: venues.length,
                        vendors: vendors.length,
                        events: approvedEvents.length,
                        myAttending: myCount
                    },
                    topVenues: venues.slice(0, 3), // Show up to 3 venues
                    upcomingEvents: approvedEvents.slice(0, 3), // Show up to 3 events
                    venueMap: vMap
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

    const getVenueImage = (v) => {
        if (v.image_url && v.image_url.startsWith('http')) return v.image_url;
        return `https://picsum.photos/seed/venue-${v.id}/800/600`;
    };

    return (
        <Box sx={{ p: 4, width: '100%' }}>
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Welcome, {user?.name}!</Typography>
                    <Typography color="text.secondary">Ready to discover your next big event?</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<RocketLaunchIcon />}
                    onClick={() => setSelectedView('events')}
                    sx={{ borderRadius: 3, px: 3, py: 1.5, fontWeight: 'bold' }}
                >
                    Browse Events
                </Button>
            </Stack>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Venues" value={dashboardData.stats.venues} icon={<LocationCityIcon />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="My Events" value={dashboardData.stats.myAttending} icon={<CheckCircleIcon />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Vendors" value={dashboardData.stats.vendors} icon={<StorefrontIcon />} color="secondary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Public Events" value={dashboardData.stats.events} icon={<EventIcon />} color="warning" />
                </Grid>
            </Grid>

            {/* Upcoming Events Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">Upcoming Events</Typography>
                <Button onClick={() => setSelectedView('events')} endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}>View All</Button>
            </Box>
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {dashboardData.upcomingEvents.length > 0 ? dashboardData.upcomingEvents.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={`https://picsum.photos/seed/${item.id}/800/600`}
                                alt="event cover"
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Typography variant="h6" fontWeight="bold" noWrap>{item.event?.name}</Typography>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarMonthIcon fontSize="small" color="action" />
                                        <Typography variant="body2">{dayjs(item.eventDate).format('MMM D, YYYY')}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon fontSize="small" color="action" />
                                        <Typography variant="body2" noWrap>
                                            {dashboardData.venueMap[item.venueId]?.name || 'Venue Loading...'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Typography variant="body1" color="text.secondary" sx={{ width: '100%', textAlign: 'center', my: 2 }}>No upcoming events.</Typography>
                )}
            </Grid>

            {/* Popular Venues Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">Popular Venues</Typography>
                <Button onClick={() => setSelectedView('venues')} endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}>View All</Button>
            </Box>
            <Grid container spacing={3}>
                {dashboardData.topVenues.length > 0 ? dashboardData.topVenues.map((venue) => (
                    <Grid item xs={12} sm={6} md={4} key={venue.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 2 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={getVenueImage(venue)}
                                alt={venue.name}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                    <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                                        {venue.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                                        ${venue.price_per_day}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                                    <LocationOnIcon fontSize="small" /> {venue.location}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Typography variant="body1" color="text.secondary" sx={{ width: '100%', textAlign: 'center', my: 2 }}>No popular venues available.</Typography>
                )}
            </Grid>
        </Box>
    );
}