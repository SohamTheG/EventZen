import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import {
    Box, Typography, TextField, Button, Paper, Stack,
    Avatar, Snackbar, Alert, alpha
} from '@mui/material';

export default function ProfileManagement() {
    // 1. Safely parse user from localStorage
    const getInitialUser = () => {
        const saved = localStorage.getItem('user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    };

    const user = getInitialUser();

    // 2. Initialize state with fallbacks to prevent 'null' being sent to DB
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });

    const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });

    const handleUpdate = async () => {
        // 1. Explicitly grab the values to ensure no "null" drift
        const currentName = formData.name;
        const currentEmail = formData.email;

        // 2. HARD STOP: If the name is null or empty, do not proceed
        if (!currentName || currentName.trim() === "") {
            setMsg({ open: true, text: "Name field is empty in state!", severity: "error" });
            setTimeout(() => window.location.reload(), 3000);
            console.error("ABORTING: Name is empty or null");
            return;
        }

        try {
            const payload = {
                id: user.id,
                full_name: currentName.trim(), // Force trim it
                email: currentEmail.trim(),
                role: user.role || 'USER'
            };

            if (formData.password && formData.password.trim() !== "") {
                payload.password = formData.password;
            }

            // 3. DEBUG: Check this in your BROWSER console (F12)
            console.log("FINAL JSON BEING SENT:", JSON.stringify(payload));

            const response = await apiClient.put(`/user/${user.id}`, payload);

            const updatedUser = { ...user, name: currentName, email: currentEmail };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMsg({ open: true, text: 'Updated! Syncing...', severity: 'success' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setMsg({ open: true, text: 'Fetch Error', severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 600, width: '100%', mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                My Profile
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}
            >
                <Stack spacing={4} alignItems="center">
                    <Avatar
                        src={`https://ui-avatars.com/api/?name=${formData.name}&size=128&background=007FFF&color=fff`}
                        sx={{ width: 120, height: 120, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    />

                    <Box sx={{ width: '100%' }}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={formData.name}
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                value={formData.email}
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                placeholder="Leave blank to keep current"
                                helperText="Only fill this if you want to change your password"
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Stack>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleUpdate}
                        sx={{
                            py: 1.8,
                            fontWeight: 'bold',
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: (theme) => `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        Save Changes
                    </Button>
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