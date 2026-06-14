import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Box, Typography, Paper, Grid, Divider, List, ListItem,
    ListItemText, Chip, Stack, CardMedia, Button
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import dayjs from 'dayjs';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';

export default function EventCalendar() {
    const [events, setEvents] = useState([]);
    const [venueMap, setVenueMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [highlightedDays, setHighlightedDays] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const vRes = await apiClient.get('/api/venues');
                const vMap = {};
                vRes.data.forEach(v => vMap[v.id] = v);
                setVenueMap(vMap);

                const bRes = await apiClient.get('/api/bookings');
                const publicEvents = bRes.data.filter(b => b.status === 'APPROVED');
                
                // Sort events by date
                publicEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                setEvents(publicEvents);

                // Map event dates to an array of day numbers for the calendar highlights
                const daysWithEvents = publicEvents.map(e => dayjs(e.eventDate).format('YYYY-MM-DD'));
                setHighlightedDays(daysWithEvents);
            } catch (err) {
                console.error("Failed to load events for calendar", err);
            }
        };
        fetchEvents();
    }, []);

    // Custom Day Renderer
    function ServerDay(props) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
        const formattedDay = day.format('YYYY-MM-DD');
        const hasEvent = !outsideCurrentMonth && highlightedDays.includes(formattedDay);
        const eventCount = highlightedDays.filter(d => d === formattedDay).length;

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                badgeContent={hasEvent ? eventCount : undefined}
                color="primary"
            >
                <PickersDay
                    {...other}
                    outsideCurrentMonth={outsideCurrentMonth}
                    day={day}
                    sx={hasEvent ? { fontWeight: 'bold', bgcolor: 'primary.light', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main' } } : {}}
                />
            </Badge>
        );
    }

    // Filter events for selected date
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    const eventsOnSelectedDate = events.filter(e => dayjs(e.eventDate).format('YYYY-MM-DD') === selectedDateStr);

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <CalendarMonthIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" fontWeight="bold">Event Calendar</Typography>
            </Stack>

            <Grid container spacing={4}>
                {/* Left Side: The Calendar */}
                <Grid item xs={12} md={5} lg={4}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 4, height: '100%' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                slots={{
                                    day: ServerDay,
                                }}
                                slotProps={{
                                    day: {
                                        highlightedDays,
                                    },
                                }}
                                sx={{
                                    width: '100%',
                                    // Make calendar slightly larger to resemble a main view
                                    '.MuiPickersCalendarHeader-root': {
                                        pt: 2, pb: 1
                                    },
                                    '.MuiPickersDay-root': {
                                        fontSize: '1rem',
                                        width: 48,
                                        height: 48,
                                        margin: 1
                                    }
                                }}
                            />
                        </LocalizationProvider>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Select a highlighted date to see scheduled events.
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Badge color="primary" variant="dot">
                                    <Typography variant="caption">Event Scheduled</Typography>
                                </Badge>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Side: Event Details */}
                <Grid item xs={12} md={7} lg={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'grey.50', height: '100%', minHeight: 400 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Events on {selectedDate.format('MMMM D, YYYY')}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {eventsOnSelectedDate.length > 0 ? (
                            <Stack spacing={3}>
                                {eventsOnSelectedDate.map(event => (
                                    <Paper key={event.id} elevation={1} sx={{ display: 'flex', borderRadius: 3, overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 160 }}
                                            image={`https://picsum.photos/seed/${event.id}/400/300`}
                                            alt={event.event?.name}
                                        />
                                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="bold">{event.event?.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {event.event?.description}
                                            </Typography>
                                            
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOnIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {venueMap[event.venueId]?.name || 'Venue'}
                                                    </Typography>
                                                </Box>
                                                <Chip label={`$${event.event?.ticketPrice?.toFixed(2) || '0.00'}`} color="primary" size="small" />
                                                <Chip label="Public" color="success" size="small" variant="outlined" />
                                            </Stack>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No events scheduled for this day.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Try selecting another date on the calendar.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
