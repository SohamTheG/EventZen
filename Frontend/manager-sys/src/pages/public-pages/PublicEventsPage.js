import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import {
    Box, Container, Typography, Grid, Card, CardContent,
    CardMedia, Chip, Stack, Button, alpha, CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';

export default function PublicEventsPage() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/api/bookings')
            .then(res => {
                const approved = res.data.filter(e => e.status === 'APPROVED');
                setEvents(approved);
            })
            .catch(err => console.error("Error loading events:", err));
    }, []);

    return (
        <Box sx={{ bgcolor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <CssBaseline enableColorScheme />

            <Box component="main" sx={{ pt: 15, pb: 10 }}>
                <Container maxWidth="lg">
                    {/* Header: Matches Landing Page Style */}
                    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" fontWeight="800" sx={{ color: '#fff', letterSpacing: '-0.02em' }}>
                            Upcoming Events
                        </Typography>
                        <Typography variant="h6" sx={{ color: alpha('#fff', 0.6), maxWidth: 600 }}>
                            Elevate your experience with our curated selection of premier gatherings.
                        </Typography>
                    </Stack>

                    <Grid container spacing={4}>
                        {events.map((booking) => (
                            <Grid item xs={12} sm={6} md={4} key={booking.id} sx={{ display: 'flex' }}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                        borderRadius: 4,
                                        bgcolor: '#0a0a0a', // Deep dark card surface
                                        border: '1px solid',
                                        borderColor: alpha('#fff', 0.1),
                                        backgroundImage: 'none',
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            borderColor: '#007FFF', // Glow color
                                            boxShadow: `0 0 20px ${alpha('#007FFF', 0.3)}`,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="220"
                                        image={`https://picsum.photos/seed/event${booking.id}/800/600`}
                                        alt="event"
                                        sx={{ filter: 'brightness(0.8)' }} // Darker image to match vibe
                                    />
                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                            <Chip
                                                label={booking.eventDate}
                                                size="small"
                                                sx={{ bgcolor: alpha('#007FFF', 0.2), color: '#007FFF', fontWeight: 'bold' }}
                                            />
                                        </Stack>

                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>
                                            {booking.event?.name || "Premier Event"}
                                        </Typography>

                                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), mb: 4, lineHeight: 1.6 }}>
                                            {booking.event?.description}
                                        </Typography>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => navigate('/login')}
                                            sx={{
                                                bgcolor: '#fff',
                                                color: '#000',
                                                fontWeight: '900',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                '&:hover': { bgcolor: alpha('#fff', 0.8) }
                                            }}
                                        >
                                            Attend Event
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}