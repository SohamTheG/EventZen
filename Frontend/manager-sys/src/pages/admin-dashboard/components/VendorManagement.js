import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Stack, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Box } from '@mui/material';

const vendorTypes = ['Catering', 'Decor', 'Photography', 'Audio/Visual', 'Security', 'Florist'];

export default function VendorManagement() {
    const [vendors, setVendors] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: '' });

    // 1. FETCH: Get all vendors from Node.js
    const fetchVendors = async () => {
        try {
            const res = await fetch('http://localhost:9001/api/vendors');
            const data = await res.json();
            setVendors(data);
        } catch (err) {
            console.error("Failed to fetch vendors:", err);
        }
    };

    useEffect(() => { fetchVendors(); }, []);

    // Open Dialog for Adding
    const handleOpenAdd = () => {
        setIsEdit(false);
        setFormData({ name: '', type: '' });
        setOpen(true);
    };

    // Open Dialog for Editing
    const handleOpenEdit = (vendor) => {
        setIsEdit(true);
        setCurrentId(vendor.id);
        setFormData({ name: vendor.name, type: vendor.type });
        setOpen(true);
    };

    // 2. SAVE: Handles both Create (POST) and Update (PUT)
    const handleSave = async () => {
        if (!formData.name || !formData.type) return alert("Please fill all fields");

        const url = isEdit
            ? `http://localhost:9001/api/vendors/${currentId}`
            : 'http://localhost:9001/api/vendors';

        const method = isEdit ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setOpen(false);
            fetchVendors();
        } catch (err) {
            console.error("Error saving vendor:", err);
        }
    };

    // 3. DELETE: Remove a vendor
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vendor?")) {
            await fetch(`http://localhost:9001/api/vendors/${id}`, { method: 'DELETE' });
            fetchVendors();
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Vendor Name', width: 250 },
        { field: 'type', headerName: 'Service Type', width: 180 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenEdit(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.id)}
                    >
                        Delete
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Stack spacing={3} sx={{ p: 2, width: '100%' }}>
            <Typography variant="h4" fontWeight="bold">Vendor Management</Typography>

            <Button
                variant="contained"
                sx={{ width: 'fit-content' }}
                onClick={handleOpenAdd}
            >
                Add New Vendor
            </Button>

            <Box sx={{ height: 500, width: '100%', backgroundColor: 'background.paper' }}>
                <DataGrid
                    rows={vendors}
                    columns={columns}
                    disableRowSelectionOnClick
                />
            </Box>

            {/* Shared Dialog for Add/Edit */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Vendor Name"
                        margin="normal"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        select
                        label="Service Type"
                        margin="normal"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        {vendorTypes.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {isEdit ? 'Update Vendor' : 'Save Vendor'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}