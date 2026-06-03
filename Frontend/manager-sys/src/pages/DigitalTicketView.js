import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Box, Card, Typography, CircularProgress, Chip, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function DigitalTicketView() {
    const { uuid } = useParams(); // Grabs the UUID from the URL
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://13.235.77.80:9002';

        fetch(`${baseUrl}/api/attendees/ticket/view/${uuid}`)
            .then(async (response) => {
                // 1. Grab the raw text FIRST, no matter what it is
                const rawText = await response.text();

                try {
                    // 2. Try to parse it as JSON
                    const data = JSON.parse(rawText);

                    if (!response.ok) throw new Error(data.message || 'Error');
                    setTicket(data);
                } catch (e) {
                    // 3. IF IT FAILS, IT PRINTS THE HTML TO THE SCREEN!
                    console.error("Server returned HTML:", rawText);
                    setError(`Server Error: ${rawText.substring(0, 100)}...`);
                }
            })
            .catch(err => {
                setError(err.message);
            });
    }, [uuid]);

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
                <Typography variant="h4" color="error" fontWeight="bold">❌ {error}</Typography>
            </Box>
        );
    }

    if (!ticket) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Card sx={{ maxWidth: 400, width: '100%', p: 3, borderRadius: 4, boxShadow: 5, textAlign: 'center' }}>

                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                    VALID TICKET
                </Typography>

                <Chip label={`Admit: ${ticket.quantity}`} color="primary" sx={{ fontSize: '1.2rem', p: 2, mb: 3 }} />

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ textAlign: 'left', backgroundColor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Ticket Holder</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{ticket.user?.name || "Guest"}</Typography>

                    <Typography variant="body2" color="text.secondary">Event ID Reference</Typography>
                    <Typography variant="body1" fontWeight="bold">#{ticket.eventId}</Typography>
                </Box>

                <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#aaa' }}>
                    Ticket ID: {ticket.ticketIdentifier}
                </Typography>
            </Card>
        </Box>
    );
}