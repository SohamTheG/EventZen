import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Typography,
    Button,
    Stack,
    Chip,
    Paper,
    Alert,
    Snackbar
} from '@mui/material';
import dayjs from 'dayjs';

export default function BookingApproval() {
    const [bookings, setBookings] = useState([]);
    const [venueMap, setVenueMap] = useState({});
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const loadData = async () => {
        try {
            // 1. Fetch Venues to map Names to IDs
            const vRes = await apiClient.get('/api/venues');
            const venues = vRes.data;
            const vMap = {};
            venues.forEach(v => vMap[v.id] = v.name);
            setVenueMap(vMap);

            // 2. Fetch All Bookings
            const bRes = await apiClient.get('/api/bookings');
            const bData = bRes.data;
            setBookings(bData);
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAction = async (id, action) => {
        try {
            // Action is either 'approve' or 'reject' matching our new Controller endpoints
            const response = await apiClient.put(`/api/bookings/admin/${id}/${action}`);


            setNotification({
                open: true,
                message: `Booking ${action === 'approve' ? 'Approved' : 'Rejected'} successfully!`,
                severity: action === 'approve' ? 'success' : 'error'
            });

            // Instantly update the UI local memory
            setBookings(prevBookings =>
                prevBookings.map(b => b.id === id ? { ...b, status: action.toUpperCase() } : b)
            );
            loadData(); // Refresh list

        } catch (err) {
            setNotification({ open: true, message: 'Server error occurred', severity: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'eventName',
            headerName: 'Event Name',
            width: 200,
            valueGetter: (value, row) => row.event?.name || 'Unnamed Event'
        },
        {
            field: 'venue',
            headerName: 'Venue',
            width: 180,
            valueGetter: (value, row) => venueMap[row.venueId] || `ID: ${row.venueId}`
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
            renderCell: (params) => {
                const colors = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'error' };
                return <Chip label={params.value} color={colors[params.value] || 'default'} variant="outlined" size="small" />;
            }
        },
        {
            field: 'actions',
            headerName: 'Review Actions',
            width: 250,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
                    {params.row.status === 'PENDING' ? (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleAction(params.id, 'approve')}
                            >
                                Approve
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleAction(params.id, 'reject')}
                            >
                                Reject
                            </Button>
                        </>
                    ) : (
                        <Typography variant="caption" color="text.secondary">Decision Recorded</Typography>
                    )}
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Booking Approval Requests
            </Typography>

            <Paper elevation={2} sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={bookings}
                    columns={columns}
                    disableRowSelectionOnClick
                    initialState={{ pagination: { paginationModel: { pageSize: 7 } } }}
                />
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}