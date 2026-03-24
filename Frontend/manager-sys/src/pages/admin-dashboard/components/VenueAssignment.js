import React, { useState, useEffect } from 'react';
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
            const venueRes = await fetch('http://localhost:9001/api/venues');
            const vendorRes = await fetch('http://localhost:9001/api/vendors');
            setVenues(await venueRes.json());
            setVendors(await vendorRes.json());
        };
        loadData();
    }, []);

    const handleAssign = async () => {
        if (!selectedVenue || !selectedVendor) return;

        try {
            const response = await fetch(
                `http://localhost:9001/api/venues/${selectedVenue}/vendors/${selectedVendor}`,
                { method: 'POST' }
            );

            if (response.ok) {
                setMessage({ type: 'success', text: 'Vendor linked to Venue successfully!' });
                setSelectedVendor(''); // Clear selection
            } else {
                setMessage({ type: 'error', text: 'Failed to link. They might already be linked.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server error. Check if Node.js is running.' });
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