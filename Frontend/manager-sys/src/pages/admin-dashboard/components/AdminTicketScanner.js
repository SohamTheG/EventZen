import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import apiClient from '../../../api/axiosConfig'; // Your authenticated client!
import { Box, Card, Typography, Button, Divider, Chip, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function AdminTicketScanner() {
    const [scannedData, setScannedData] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // This fires automatically when the camera sees a QR code
    const handleScan = async (result, error) => {
        if (!!result && !loading && !ticket) {
            setLoading(true);
            setError('');

            try {
                // The QR code contains the full URL (e.g. https://.../ticket/view/uuid)
                // We just need to extract the UUID from the very end of it.
                const urlParts = result?.text.split('/');
                const uuid = urlParts[urlParts.length - 1];

                // Fetch using your SECURE API client (JWT token is attached automatically!)
                const response = await apiClient.get(`/api/attendees/ticket/view/${uuid}`);
                setTicket(response.data);
            } catch (err) {
                setError('Invalid, Fake, or Expired Ticket.');
            } finally {
                setLoading(false);
            }
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
                    <QrReader
                        onResult={handleScan}
                        constraints={{ facingMode: 'environment' }} // Forces the back camera on phones!
                        style={{ width: '100%' }}
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