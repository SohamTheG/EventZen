import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner'; // <-- The new modern import
import apiClient from '../../../api/axiosConfig';
import { Box, Card, Typography, Button, Divider, Chip, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function AdminTicketScanner() {
    const [scannedData, setScannedData] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // The new library passes the raw text directly as the first argument
    const handleScan = async (result) => {
        try {
            // 1. Safely grab the text. The new library might pass an object or an array.
            const rawText = result?.[0]?.rawValue || result?.rawValue || (typeof result === 'string' ? result : null);

            // Ignore empty scans
            if (!rawText) return;

            // 2. Only proceed if we aren't already loading a ticket
            if (!loading && !ticket) {
                setLoading(true);
                setError('');

                // 3. Extract the UUID
                const urlParts = rawText.split('/');
                const uuid = urlParts[urlParts.length - 1];

                // 4. Fetch the data
                const response = await apiClient.get(`/api/attendees/ticket/view/${uuid}`);
                setTicket(response.data);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);

            // THE MAGIC MOBILE DEBUGGER:
            // Grab the exact error message, even if it's buried deep
            const exactError = err.response?.data?.message || err.message || JSON.stringify(err);

            // Force the phone to throw a native pop-up warning!
            alert("MOBILE CRASH REPORT:\n\n" + exactError);

            setError(exactError);
        }
    };

    const resetScanner = () => {
        setTicket(null);
        setError('');
        setScannedData(null);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Staff Scanner</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Point camera at attendee's digital ticket.
            </Typography>

            {!ticket && !error && (
                <Card sx={{ p: 1, borderRadius: 4, overflow: 'hidden', boxShadow: 3, mb: 3 }}>
                    <Scanner
                        onResult={(text) => handleScan(text)}
                        onError={(error) => console.error(error?.message)}
                        options={{ delayBetweenScanAttempts: 1000 }}
                    />
                </Card>
            )}

            {loading && <CircularProgress sx={{ mt: 4 }} />}

            {error && (
                <Box sx={{ mt: 4, p: 3, backgroundColor: '#ffebee', borderRadius: 3 }}>
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="h5" color="error" fontWeight="bold">{error}</Typography>
                    <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={resetScanner}>
                        Scan Next Ticket
                    </Button>
                </Box>
            )}

            {ticket && (
                <Card sx={{ p: 4, borderRadius: 4, boxShadow: 5, mt: 2, border: '3px solid #4caf50' }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                        ACCESS GRANTED
                    </Typography>

                    <Chip label={`Admit: ${ticket.quantity}`} color="primary" sx={{ fontSize: '1.5rem', p: 3, mb: 3 }} />
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">Ticket Holder</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{ticket.user?.name || "Guest"}</Typography>

                        <Typography variant="body2" color="text.secondary">Event ID</Typography>
                        <Typography variant="body1" fontWeight="bold">#{ticket.eventId}</Typography>
                    </Box>

                    <Button fullWidth variant="contained" color="success" size="large" sx={{ mt: 4 }} onClick={resetScanner}>
                        Admit & Scan Next
                    </Button>
                </Card>
            )}
        </Box>
    );
}