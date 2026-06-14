import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Grid, Card, CardContent, Typography, Box,
    Stack, Divider, CardMedia, Button
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import dayjs from 'dayjs';

export default function SearchResults({ query }) {
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // Fetch all data
                const vRes = await apiClient.get('/api/venues');
                const allVenues = vRes.data;

                const bRes = await apiClient.get('/api/bookings');
                const allEvents = bRes.data.filter(b => b.status === 'APPROVED');

                if (!query || query.trim() === '') {
                    setEvents([]);
                    setVenues([]);
                    setLoading(false);
                    return;
                }

                const lowerQuery = query.toLowerCase();

                // Filter Events by name, description, or venue location
                const filteredEvents = allEvents.filter(b => {
                    const venueStr = (allVenues.find(v => v.id === b.venueId)?.name || '').toLowerCase();
                    return (
                        (b.event?.name || '').toLowerCase().includes(lowerQuery) ||
                        (b.event?.description || '').toLowerCase().includes(lowerQuery) ||
                        venueStr.includes(lowerQuery)
                    );
                });

                // Filter Venues by name or location
                const filteredVenues = allVenues.filter(v => 
                    (v.name || '').toLowerCase().includes(lowerQuery) ||
                    (v.location || '').toLowerCase().includes(lowerQuery)
                );

                setEvents(filteredEvents);
                setVenues(filteredVenues);
            } catch (err) {
                console.error("Search Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return <Typography sx={{ p: 4 }}>Loading search results...</Typography>;
    }

    const hasResults = events.length > 0 || venues.length > 0;

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Search Results for "{query}"
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {!hasResults ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary">No matching events or venues found.</Typography>
                </Box>
            ) : (
                <Stack spacing={6}>
                    {/* Event Results */}
                    {events.length > 0 && (
                        <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Events</Typography>
                            <Grid container spacing={3}>
                                {events.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={`evt-${item.id}`}>
                                        <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`https://picsum.photos/seed/${item.id}/800/600`}
                                                alt="event cover"
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>{item.event?.name}</Typography>
                                                <Stack spacing={1} sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarMonthIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">{dayjs(item.eventDate).format('MMMM D, YYYY')}</Typography>
                                                    </Box>
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {item.event?.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Venue Results */}
                    {venues.length > 0 && (
                        <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Venues</Typography>
                            <Grid container spacing={3}>
                                {venues.map((venue) => (
                                    <Grid item xs={12} sm={6} md={4} key={`ven-${venue.id}`}>
                                        <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={venue.image_url?.startsWith('http') ? venue.image_url : `https://picsum.photos/seed/venue-${venue.id}/800/600`}
                                                alt={venue.name}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" fontWeight="bold">{venue.name}</Typography>
                                                <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} /> {venue.location}
                                                </Typography>
                                                <Typography variant="body2" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                                                    ${venue.price_per_day} / day
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
}
