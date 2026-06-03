import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Grid, Card, CardContent, Typography, Box, Chip,
    Stack, Divider, CardMedia, CardActions, Button, Snackbar, Alert, Dialog
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';

export default function PublicEvents() {
    const [events, setEvents] = useState([]);
    const [venueMap, setVenueMap] = useState({});
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // NEW STATE VARIABLES FOR BOOKING
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [purchasedTicket, setPurchasedTicket] = useState(null);

    const loadPublicData = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        try {
            const vRes = await apiClient.get('/api/venues');
            const venues = vRes.data;
            const vMap = {};
            venues.forEach(v => vMap[v.id] = v);
            setVenueMap(vMap);

            const bRes = await apiClient.get('/api/bookings');
            const allBookings = bRes.data;
            const publicOnly = allBookings.filter(b => b.status === 'APPROVED');
            setEvents(publicOnly);

            if (loggedInUser) {
                const aRes = await apiClient.get('/api/attendees/all');
                const allAttendees = aRes.data;
                const myEvents = allAttendees
                    .filter(a => a.user?.id === loggedInUser.id)
                    .map(a => a.eventId);
                setUserRegistrations(myEvents);
            }
        } catch (err) {
            console.error("Error loading public events:", err);
        }
    };

    useEffect(() => {
        loadPublicData();
    }, []);

    // OPEN THE MODAL INSTEAD OF INSTANT BOOKING
    const handleOpenModal = (eventItem) => {
        setSelectedEvent(eventItem);
        setQuantity(1); // Reset counter
        setPurchasedTicket(null); // Clear old QR codes
        setBookingModalOpen(true);
    };

    // THE ACTUAL API CALL (Triggered from inside the modal)
    const handleAttend = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));

        if (!loggedInUser) {
            setSnackbar({ open: true, message: 'Please log in to attend events', severity: 'error' });
            return;
        }

        const payload = {
            eventId: selectedEvent.id,
            user: { id: loggedInUser.id },
            quantity: quantity // Send the selected quantity!
        };

        try {
            const response = await apiClient.post('/api/attendees/register', payload);
            setSnackbar({ open: true, message: "Registration successful!", severity: 'success' });

            // Save the backend response to display the QR Code
            setPurchasedTicket(response.data);
            setUserRegistrations([...userRegistrations, selectedEvent.id]);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'You are already registered or server error';
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Upcoming Public Events</Typography>

            <Grid container spacing={3}>
                {events.length > 0 ? events.map((item) => {
                    const isAttending = userRegistrations.includes(item.id);

                    return (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={`https://picsum.photos/seed/${item.id}/800/600`}
                                    alt="event cover"
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>{item.event?.name}</Typography>
                                    <Stack spacing={1} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarMonthIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{dayjs(item.eventDate).format('MMMM D, YYYY')}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon fontSize="small" color="action" />
                                            <Typography variant="body2" fontWeight="medium">
                                                {venueMap[item.venueId]?.name || 'Venue Loading...'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                                        {item.event?.description}
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                            ${item.event?.ticketPrice?.toFixed(2) || "0.00"}
                                        </Typography>
                                        <Chip label="Verified" size="small" color="success" variant="outlined" />
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant={isAttending ? "outlined" : "contained"}
                                        color={isAttending ? "success" : "primary"}
                                        disabled={isAttending}
                                        startIcon={isAttending ? <CheckCircleIcon /> : null}
                                        sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                        // THIS WAS THE MISSING LINK! 
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        {isAttending ? "Attending" : "Buy Tickets"}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                }) : (
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
                        No events found.
                    </Typography>
                )}
            </Grid>

            {/* THE CHECKOUT MODAL */}
            <Dialog open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} maxWidth="sm" fullWidth>
                {purchasedTicket ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Payment Successful!</Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>You bought {purchasedTicket.quantity} tickets.</Typography>

                        <Box sx={{ border: '2px dashed #ccc', p: 2, display: 'inline-block', borderRadius: 2 }}>
                            <img
                                src={`data:image/png;base64,${purchasedTicket.qrCodeBase64}`}
                                alt="Your Ticket QR Code"
                                style={{ width: '200px', height: '200px' }}
                            />
                        </Box>

                        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                            Show this QR code at the venue entrance.
                        </Typography>
                        <Button variant="contained" onClick={() => { setBookingModalOpen(false); setPurchasedTicket(null); loadPublicData(); }} sx={{ mt: 3 }}>
                            Close Window
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Checkout: {selectedEvent?.event?.name}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h6">Number of Tickets</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button variant="outlined" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                                <Typography variant="h6" fontWeight="bold" sx={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</Typography>
                                <Button variant="outlined" onClick={() => setQuantity(quantity + 1)}>+</Button>
                            </Box>
                        </Box>

                        <Box sx={{ backgroundColor: '#f8f9fa', p: 3, borderRadius: 2, mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Ticket Price:</Typography>
                                <Typography>${selectedEvent?.event?.ticketPrice?.toFixed(2) || "0.00"}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="bold">Total Due:</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    ${((selectedEvent?.event?.ticketPrice || 0) * quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Button fullWidth variant="contained" color="primary" size="large" onClick={handleAttend}>
                            Pay & Generate Ticket
                        </Button>
                    </Box>
                )}
            </Dialog>

            <Snackbar
                open={snackbar.open} autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}