import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import { Box, Button, MenuItem, TextField, Typography, Stack, Paper, Alert } from '@mui/material';

export default function VenueAssignment() {
    const [venues, setVenues] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState('');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Load both lists so we can populate the dropdowns
        const loadData = async () => {
            try {
                const venueRes = await apiClient.get('/api/venues');
                const vendorRes = await apiClient.get('/api/vendors');
                setVenues(venueRes.data);
                setVendors(vendorRes.data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

    const handleAssign = async () => {
        if (!selectedVenue || !selectedVendor) return;

        try {
            const response = await apiClient.post(
                `/api/venues/${selectedVenue}/vendors/${selectedVendor}`
            );

            setMessage({ type: 'success', text: 'Vendor linked to Venue successfully!' });
            setSelectedVendor(''); // Clear selection
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to link. They might already be linked.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Assign Vendors to Venues
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a venue and a service provider to create a partnership.
            </Typography>

            <Stack spacing={3}>
                {message.text && (
                    <Alert severity={message.type} onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}

                <TextField
                    select
                    fullWidth
                    label="Select Venue"
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                >
                    {venues.map((v) => (
                        <MenuItem key={v.id} value={v.id}>{v.name} ({v.location})</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Select Vendor"
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                >
                    {vendors.map((v) => (
                        <MenuItem key={v.id} value={v.id}>{v.name} - {v.type}</MenuItem>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleAssign}
                    disabled={!selectedVenue || !selectedVendor}
                >
                    Link Vendor to Venue
                </Button>
            </Stack>
        </Paper>
    );
}