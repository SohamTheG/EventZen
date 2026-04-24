import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Chip, Avatar, Stack } from '@mui/material';

export default function UserManagement() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/auth/all');
            const data = response.data;
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { field: 'id', headerName: 'User ID', width: 100 },
        {
            field: 'full_name',
            headerName: 'Full Name',
            width: 200,
            renderCell: (params) => {
                (
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                            {params.value?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{params.value}</Typography>
                    </Stack>
                )
            }
        },
        { field: 'email', headerName: 'Email Address', width: 250 },
        {
            field: 'role',
            headerName: 'Role',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value?.toUpperCase()}
                    color={params.value?.toUpperCase() === 'ADMIN' ? 'error' : 'info'}
                    size="small"
                    variant="filled"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Status',
            width: 150,
            renderCell: () => (
                <Chip label="Active" color="success" size="small" variant="outlined" />
            )
        }
    ];

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                System User Directory
            </Typography>
            <Paper elevation={3} sx={{ height: 600, width: '100%', borderRadius: 2 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSizeOptions={[10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{ border: 'none' }}
                />
            </Paper>
        </Box>
    );
}