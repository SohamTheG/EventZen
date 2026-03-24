import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Grid, Card, CardContent,
    CardMedia, Stack, Button, Rating, alpha, CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import AppNavbar from './components/AppNavbar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';

export default function PublicVenuesPage() {
    const [venues, setVenues] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:9001/api/venues')
            .then(res => res.json())
            .then(setVenues)
            .catch(err => console.error("Error loading venues:", err));
    }, []);

    return (
        <Box sx={{ bgcolor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <CssBaseline enableColorScheme />
            {/* <AppNavbar /> */}

            <Box component="main" sx={{ pt: 15, pb: 10 }}>
                <Container maxWidth="lg">
                    {/* Hero Section */}
                    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" fontWeight="800" sx={{ color: '#fff', letterSpacing: '-0.02em' }}>
                            Our Venues
                        </Typography>
                        <Typography variant="h6" sx={{ color: alpha('#fff', 0.6), maxWidth: 600 }}>
                            From cozy urban escapes to massive arenas. Explore the perfect stage for your next event.
                        </Typography>
                        <Box sx={{ width: 80, height: 4, bgcolor: '#007FFF', borderRadius: 2, mt: 2 }} />
                    </Stack>

                    <Grid container spacing={4}>
                        {venues.map((venue) => (
                            <Grid item xs={12} sm={6} md={4} key={venue.id} sx={{ display: 'flex' }}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                        borderRadius: 4,
                                        bgcolor: '#0a0a0a', // Deep surface
                                        border: '1px solid',
                                        borderColor: alpha('#fff', 0.1),
                                        backgroundImage: 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            borderColor: '#d327b4', // Venue-specific glow (Pink/Magenta)
                                            boxShadow: `0 0 30px ${alpha('#d327b4', 0.2)}`,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={`https://picsum.photos/seed/venue${venue.id}/800/600`}
                                        alt={venue.name}
                                        sx={{ filter: 'brightness(0.7)' }} // Darker to fit the vibe
                                    />
                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', mb: 1 }}>
                                            {venue.name}
                                        </Typography>

                                        <Typography sx={{ color: '#d327b4', fontWeight: '800', fontSize: '1.2rem', mb: 2 }}>
                                            ${venue.price_per_day}
                                            <Typography component="span" sx={{ color: alpha('#fff', 0.4), fontSize: '0.8rem', ml: 1 }}>
                                                / PER DAY
                                            </Typography>
                                        </Typography>

                                        <Stack spacing={1} sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: alpha('#fff', 0.6) }}>
                                                <LocationOnIcon fontSize="small" />
                                                <Typography variant="body2">{venue.location}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: alpha('#fff', 0.6) }}>
                                                <GroupsIcon fontSize="small" />
                                                <Typography variant="body2">Up to {venue.capacity} guests</Typography>
                                            </Box>
                                        </Stack>

                                        <Rating
                                            value={4.5}
                                            precision={0.5}
                                            readOnly
                                            size="small"
                                            sx={{ mb: 3, '& .MuiRating-iconFilled': { color: '#d327b4' } }}
                                        />

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
                                                textTransform: 'none',
                                                '&:hover': { bgcolor: alpha('#fff', 0.8) }
                                            }}
                                        >
                                            Book this Venue
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