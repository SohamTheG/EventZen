import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Container, Stack, Typography, CardActionArea } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FestivalIcon from '@mui/icons-material/Festival';

const serviceCards = [
    {
        icon: <EventIcon sx={{ fontSize: 40 }} />,
        title: 'Ongoing Events',
        description: 'Browse live concerts and corporate gatherings happening now.',
        path: '/events',
        color: '#007FFF',
    },
    {
        icon: <FestivalIcon sx={{ fontSize: 40 }} />,
        title: 'Explore Venues',
        description: 'Find the perfect space for your next big idea.',
        path: '/venues',
        color: '#d327b4',
    },
    {
        icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
        title: 'Join the Network',
        description: 'Create an account to start booking or managing.',
        path: '/login',
        color: '#FF9800',
    },
];

export default function ServiceHighlights() {
    return (
        <Box sx={{ py: 10, bgcolor: 'background.default', width: '100%' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" textAlign="center" fontWeight="900" sx={{ mb: 8 }}>
                    Quick Access
                </Typography>

                {/* USING FLEX INSTEAD OF GRID TO FORCE HORIZONTAL ALIGNMENT */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, Row on desktop
                    gap: 3,
                    justifyContent: 'center',
                    alignItems: 'stretch' // Makes all cards same height
                }}>
                    {serviceCards.map((card, index) => (
                        <Card
                            key={index}
                            sx={{
                                flex: 1, // This forces them to share width equally (33% each)
                                minWidth: { md: '300px' },
                                borderRadius: 5,
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    borderColor: card.color,
                                    boxShadow: `0 15px 30px ${card.color}20`
                                }
                            }}
                        >
                            <CardActionArea
                                component={Link}
                                to={card.path}
                                sx={{ height: '100%', p: 4, textAlign: 'center' }}
                            >
                                <Stack spacing={2} alignItems="center">
                                    <Box sx={{ color: card.color, p: 2, bgcolor: `${card.color}10`, borderRadius: 3 }}>
                                        {card.icon}
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </Stack>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}