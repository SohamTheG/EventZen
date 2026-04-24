import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import {
    Button, Stack, Typography, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, Chip, Box
} from '@mui/material';

export default function VenueManagement() {
    const [venues, setVenues] = useState([]);
    const [allVendors, setAllVendors] = useState([]); // List for the dropdown
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        price_per_day: '',
        selectedVendorIds: [] // New field for the UI
    });

    const fetchVenues = async () => {
        try {
            const res = await apiClient.get('/api/venues');
            const data = res.data;
            setVenues(data);
        } catch (error) {
            console.error('Error fetching venues:', error);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await apiClient.get('/api/vendors');
            const data = res.data;
            setAllVendors(data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchVenues();
        fetchVendors();
    }, []);

    const handleOpenAdd = () => {
        setIsEdit(false);
        setFormData({ name: '', location: '', capacity: '', price_per_day: '', selectedVendorIds: [] });
        setOpen(true);
    };

    const handleOpenEdit = (venue) => {
        setIsEdit(true);
        setCurrentId(venue.id);
        // If your venue object includes its vendors, pre-fill them here
        const existingVendorIds = venue.Vendors ? venue.Vendors.map(v => v.id) : [];

        setFormData({
            name: venue.name,
            location: venue.location,
            capacity: venue.capacity,
            price_per_day: venue.price_per_day,
            selectedVendorIds: existingVendorIds
        });
        setOpen(true);
    };

    const handleSave = async () => {
        const url = isEdit
            ? `/api/venues/${currentId}`
            : '/api/venues';

        try {
            // 1. Save the Venue
            const response = isEdit
                ? await apiClient.put(url, {
                    name: formData.name,
                    location: formData.location,
                    capacity: formData.capacity,
                    price_per_day: formData.price_per_day
                })
                : await apiClient.post(url, {
                    name: formData.name,
                    location: formData.location,
                    capacity: formData.capacity,
                    price_per_day: formData.price_per_day
                });

            const savedVenue = response.data;
            const venueId = isEdit ? currentId : savedVenue.id;

            // 2. Loop through selected vendors and link them to this Venue
            if (formData.selectedVendorIds.length > 0) {
                await Promise.all(
                    formData.selectedVendorIds.map(vendorId =>
                        apiClient.post(`/api/venues/${venueId}/vendors/${vendorId}`)
                    )
                );
            }

            setOpen(false);
            fetchVenues();
        } catch (error) {
            console.error('Error saving venue:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Venue Name', width: 200 },
        { field: 'location', headerName: 'Location', width: 150 },
        { field: 'capacity', headerName: 'Capacity', type: 'number', width: 110 },
        { field: 'price_per_day', headerName: 'Price/Day', width: 130 },
        {
            field: 'Vendors',
            headerName: 'Assigned Vendors',
            width: 300,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {params.value && params.value.length > 0 ? (
                        params.value.map((vendor) => (
                            <Chip
                                key={vendor.id}
                                label={vendor.name}
                                size="large"
                                variant="outlined"
                                color="primary"
                            />
                        ))
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            No vendors linked
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
                    <Button variant="outlined" size="small" onClick={() => handleOpenEdit(params.row)}>
                        Edit
                    </Button>
                    <Button color="error" variant="outlined" size="small" onClick={async () => {
                        if (window.confirm("Delete this venue?")) {
                            try {
                                await apiClient.delete(`/api/venues/${params.id}`);
                                fetchVenues();
                            } catch (error) {
                                console.error('Error deleting venue:', error);
                            }
                        }
                    }}>
                        Delete
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Stack spacing={3} sx={{ width: '100%' }}>
            <Typography variant="h4" fontWeight="bold">Venue Management</Typography>
            <Button variant="contained" sx={{ width: 'fit-content' }} onClick={handleOpenAdd}>
                Add Venue
            </Button>

            <div style={{ height: 450, width: '100%' }}>
                <DataGrid rows={venues} columns={columns} sx={{ backgroundColor: 'background.paper' }} />
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{isEdit ? 'Update Venue & Partnerships' : 'Add New Venue'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Venue Name" margin="normal" value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Location" margin="normal" value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth label="Capacity" type="number" margin="normal" value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                        <TextField
                            fullWidth label="Price Per Day" type="number" margin="normal" value={formData.price_per_day}
                            onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                        />
                    </Stack>

                    {/* NEW: Multi-select for Vendor Assignment */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="vendor-select-label">Assign Vendors</InputLabel>
                        <Select
                            labelId="vendor-select-label"
                            multiple
                            value={formData.selectedVendorIds}
                            label="Assign Vendors"
                            onChange={(e) => setFormData({ ...formData, selectedVendorIds: e.target.value })}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={allVendors.find(v => v.id === value)?.name} />
                                    ))}
                                </Box>
                            )}
                        >
                            {allVendors.map((vendor) => (
                                <MenuItem key={vendor.id} value={vendor.id}>
                                    {vendor.name} ({vendor.type})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {isEdit ? 'Update All' : 'Save Venue'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}