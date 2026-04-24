import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    Stack
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function VenueBrowser() {
    const [venues, setVenues] = useState([]);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [bookingData, setBookingData] = useState({
        eventName: '',
        eventDescription: '',
        eventDate: dayjs().add(7, 'day'), // Default to a week from now
    });

    const handleOpenBooking = (venue) => {
        setSelectedVenue(venue);
        setBookingOpen(true);
    };

    const handleConfirmBooking = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        // The structure matches your Spring Boot Booking/Event entities
        const payload = {
            eventDate: bookingData.eventDate.format('YYYY-MM-DD'),
            venueId: selectedVenue.id,
            status: "PENDING",
            event: {
                name: bookingData.eventName,
                description: bookingData.eventDescription,
                hostId: user.id // Linking the logged-in user
            }
        };

        try {
            const response = await apiClient.post('/api/bookings', payload);
            alert("Booking request sent! Wait for Admin approval.");
            setBookingOpen(false);
        } catch (error) {
            console.error("Booking failed:", error);
            alert('Booking failed: ' + (error.response?.data?.message || error.message));
        }
    };
    const getVenueImage = (v) => {
        if (v.image_url && v.image_url.startsWith('http')) return v.image_url;
        // Fallback to random architecture/interior photo
        return `https://picsum.photos/seed/venue-${v.id}/800/600`;
    };

    useEffect(() => {
        apiClient.get('/api/venues')
            .then(res => setVenues(res.data))
            .catch(err => console.error("Error loading venues:", err));
    }, []);

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Explore Venues
            </Typography>
            <Grid container spacing={4}>
                {venues.map((venue) => (
                    <Grid item xs={12} sm={6} md={4} key={venue.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            {/* Top Image - Using a placeholder if venue.image doesn't exist */}
                            <CardMedia
                                component="img"
                                height="200"
                                image={getVenueImage(venue)}
                                alt={venue.name}
                            />

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        {venue.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                                        ${venue.price_per_day}
                                    </Typography>
                                </Stack>

                                <Typography color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                                    📍 {venue.location}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Max Capacity: <strong>{venue.capacity} guests</strong>
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {/* Vendor Section */}
                                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                    Available Services:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                    {venue.Vendors && venue.Vendors.length > 0 ? (
                                        venue.Vendors.map((vendor) => (
                                            <Chip
                                                key={vendor.id}
                                                label={vendor.name}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            Self-service venue
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>

                            <Divider />
                            <CardActions sx={{ p: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={() => handleOpenBooking(venue)}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Book Now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Book {selectedVenue?.name}</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Event Name"
                                placeholder="e.g. My Awesome Birthday"
                                onChange={(e) => setBookingData({ ...bookingData, eventName: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Event Description"
                                onChange={(e) => setBookingData({ ...bookingData, eventDescription: e.target.value })}
                            />
                            <DatePicker
                                label="Event Date"
                                value={bookingData.eventDate}
                                onChange={(newValue) => setBookingData({ ...bookingData, eventDate: newValue })}
                                disablePast
                            />
                            <Typography variant="caption" color="text.secondary">
                                Note: A request will be sent to the Admin. You will be notified once approved.
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setBookingOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmBooking}
                            disabled={!bookingData.eventName}
                        >
                            Confirm Request
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </Box>
    );
}