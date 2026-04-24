import React, { useState } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Box, Typography, TextField, Button, Paper, Stack,
    Avatar, Snackbar, Alert, Chip
} from '@mui/material';

export default function ProfileManagement() {
    // 1. Get the current user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Initialize state
    const [formData, setFormData] = useState({
        id: user?.id,
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'CUSTOMER'
    });

    const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });

    const handleUpdate = async () => {
        try {
            // 3. MAP THE PAYLOAD: Link React 'name' to Java 'full_name'
            const payload = {
                id: formData.id,
                full_name: formData.name, // The fix for your "null" name issue
                email: formData.email,
                role: formData.role
            };

            // Only add password to the JSON if the user actually typed a new one
            if (formData.password && formData.password.trim() !== "") {
                payload.password = formData.password;
            }

            console.log("Sending fixed payload:", payload);

            const response = await apiClient.put(`/user/${user.id}`, payload);

            // 4. Update localStorage
            const updatedUser = { ...user, name: formData.name, email: formData.email };
            delete updatedUser.password;

            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMsg({ open: true, text: 'Profile updated successfully! Syncing...', severity: 'success' });

            // 5. Reset password field in UI
            setFormData(prev => ({ ...prev, password: '' }));

            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            console.error("Update Error:", err);
            setMsg({ open: true, text: 'Failed to update profile', severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, width: '100%', mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">My Profile</Typography>
                <Chip
                    label={formData.role}
                    color={formData.role === 'ADMIN' ? 'error' : 'primary'}
                    variant="filled"
                    sx={{ fontWeight: 'bold' }}
                />
            </Stack>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Stack spacing={3} alignItems="center">
                    <Avatar
                        src={`https://ui-avatars.com/api/?name=${formData.name}&size=128&background=007FFF&color=fff`}
                        sx={{ width: 100, height: 100, mb: 2, boxShadow: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <TextField
                        fullWidth
                        label="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        placeholder="Leave blank to keep current password"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <Box sx={{ width: '100%', mt: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleUpdate}
                            sx={{
                                py: 1.5,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem'
                            }}
                        >
                            Save Profile Changes
                        </Button>
                    </Box>
                </Stack>
            </Paper>

            <Snackbar
                open={msg.open}
                autoHideDuration={4000}
                onClose={() => setMsg({ ...msg, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={msg.severity} variant="filled" sx={{ width: '100%' }}>
                    {msg.text}
                </Alert>
            </Snackbar>
        </Box>
    );
}