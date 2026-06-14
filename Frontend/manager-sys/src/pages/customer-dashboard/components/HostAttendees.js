import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Select,
    MenuItem, FormControl, InputLabel, Chip, Stack, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function HostAttendees() {
    const [myEvents, setMyEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchHostEvents = async () => {
            if (!user?.id) return;
            try {
                // Fetch the events hosted by this user
                const response = await apiClient.get(`/api/bookings/customer/${user.id}`);
                // Only show APPROVED events where people can actually register
                const approvedEvents = response.data.filter(b => b.status === 'APPROVED');
                setMyEvents(approvedEvents);
                if (approvedEvents.length > 0) {
                    setSelectedEventId(approvedEvents[0].event?.id);
                }
            } catch (err) {
                console.error("Failed to fetch host events", err);
            }
        };
        fetchHostEvents();
    }, [user?.id]);

    useEffect(() => {
        if (!selectedEventId) return;
        const fetchAttendees = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/attendees/event/${selectedEventId}`);
                setAttendees(response.data);
            } catch (err) {
                console.error("Failed to fetch attendees", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendees();
    }, [selectedEventId]);

    const handleRemoveAttendee = async (attendeeId) => {
        if (!window.confirm("Are you sure you want to remove this attendee?")) return;
        try {
            await apiClient.delete(`/api/attendees/${attendeeId}`);
            setAttendees(attendees.filter(a => a.id !== attendeeId));
        } catch (err) {
            alert(err.response?.data || "Error removing attendee");
        }
    };

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Manage Attendees</Typography>
                
                {myEvents.length > 0 && (
                    <FormControl sx={{ minWidth: 250 }}>
                        <InputLabel>Select Event</InputLabel>
                        <Select
                            value={selectedEventId}
                            label="Select Event"
                            onChange={(e) => setSelectedEventId(e.target.value)}
                        >
                            {myEvents.map(booking => (
                                <MenuItem key={booking.id} value={booking.event?.id}>
                                    {booking.event?.name} ({booking.eventDate})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Stack>

            {myEvents.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">You don't have any approved events yet.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Attendee Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Quantity</strong></TableCell>
                                <TableCell><strong>Ticket Status</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={30} />
                                    </TableCell>
                                </TableRow>
                            ) : attendees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        No attendees registered for this event yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attendees.map((att) => (
                                    <TableRow key={att.id} hover>
                                        <TableCell>{att.user?.name || 'Unknown'}</TableCell>
                                        <TableCell>{att.user?.email || 'N/A'}</TableCell>
                                        <TableCell>{att.quantity || 1}</TableCell>
                                        <TableCell>
                                            <Chip label="Confirmed" size="small" color="success" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleRemoveAttendee(att.id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
