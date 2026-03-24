import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Chip, Avatar } from '@mui/material';

export default function AttendeeManagement() {
    const [attendees, setAttendees] = useState([]);
    const [bookingMap, setBookingMap] = useState({}); // To map eventId to Event Name

    const loadData = async () => {
        try {
            // 1. Fetch Bookings from Port 9002 to get Event Names
            const bRes = await fetch('http://localhost:9002/api/bookings');
            const bookings = await bRes.json();
            const bMap = {};
            bookings.forEach(b => {
                bMap[b.id] = b.event?.name || `Event #${b.id}`;
            });
            setBookingMap(bMap);

            // 2. Fetch All Attendees from Port 9000
            const aRes = await fetch('http://localhost:9000/api/attendees/all');
            const aData = await aRes.json();
            setAttendees(aData);
        } catch (err) {
            console.error("Error loading attendee data:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        // {
        //     field: 'userName',
        //     headerName: 'Attendee Name',
        //     width: 200,
        //     renderCell: (params) => (
        //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        //             <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
        //                 {params.row.user?.name?.charAt(0) || 'U'}
        //             </Avatar>
        //             <Typography variant="body2">{params.row.user?.name || 'Unknown'}</Typography>
        //         </Box>
        //     )
        // },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            valueGetter: (v, row) => row.user?.email || 'N/A'
        },
        {
            field: 'eventName',
            headerName: 'Attending Event',
            width: 250,
            renderCell: (params) => (
                <Chip
                    label={bookingMap[params.row.eventId] || `Loading Event ${params.row.eventId}...`}
                    variant="outlined"
                    color="primary"
                />
            )
        },
        {
            field: 'status',
            headerName: 'Role Status',
            width: 150,
            valueGetter: (v, row) => row.user?.role || 'USER'
        }
    ];

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Master Attendee List
            </Typography>
            <Paper elevation={3} sx={{ height: 600, width: '100%', borderRadius: 2 }}>
                <DataGrid
                    rows={attendees}
                    columns={columns}
                    pageSizeOptions={[10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
                    }}
                />
            </Paper>
        </Box>
    );
}