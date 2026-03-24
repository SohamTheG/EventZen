import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Chip } from '@mui/material';
import dayjs from 'dayjs';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [venueMap, setVenueMap] = useState({}); // To store { id: "Venue Name" }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        const loadData = async () => {
            try {
                // 1. Fetch Venues from Node.js to get the names
                const venueRes = await fetch('http://localhost:9001/api/venues');
                const venues = await venueRes.json();

                // Convert array to an easy-to-search object: { 1: "Grand Hall", 2: "Beach Resort" }
                const vMap = {};
                venues.forEach(v => { vMap[v.id] = v.name; });
                setVenueMap(vMap);

                // 2. Fetch Bookings from Spring Boot
                if (user && user.id) {
                    const bookingRes = await fetch(`http://localhost:9002/api/bookings/customer/${user.id}`);
                    const bookingData = await bookingRes.json();
                    setBookings(bookingData);
                }
            } catch (err) {
                console.error("Data loading failed:", err);
            }
        };

        loadData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'eventName',
            headerName: 'Event Name',
            width: 200,
            valueGetter: (value, row) => row.event?.name || 'N/A'
        },
        {
            field: 'venueName', // Changed from venueId
            headerName: 'Venue',
            width: 200,
            // Use the venueMap to find the name based on the ID from the row
            valueGetter: (value, row) => venueMap[row.venueId] || `Venue #${row.venueId}`
        },
        {
            field: 'eventDate',
            headerName: 'Date',
            width: 130,
            valueFormatter: (value) => dayjs(value).format('DD MMM YYYY')
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'APPROVED' ? 'success' : params.value === 'REJECTED' ? 'error' : 'warning'}
                    variant="outlined"
                    size="small"
                />
            ),
        }
    ];

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>My Bookings</Typography>
            <Box sx={{ height: 400, width: '100%', backgroundColor: 'background.paper', borderRadius: 2 }}>
                <DataGrid
                    rows={bookings}
                    columns={columns}
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    );
}