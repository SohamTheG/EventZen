import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SignInPage from '../pages/sign-in/SignIn';
// import EventListPage from '../pages/EventListPage';
import SignUpPage from '../pages/sign-up/SignUp';
import AdminDashboard from '../pages/admin-dashboard/admin-Dashboard'
import CustomerDashboard from '../pages/customer-dashboard/CustomerDashboard'
import BookingApproval from 'pages/admin-dashboard/components/BookingApproval';

import PublicEventsPage from 'pages/public-pages/PublicEventsPage';
import PublicVenuesPage from 'pages/public-pages/PublicVenuesPage';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Dashboards */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />

            <Route path="/events" element={<PublicEventsPage />} />
            <Route path="/venues" element={<PublicVenuesPage />} />
            {/* Venue Catalog (from Node.js) */}
            {/* <Route path="/explore-venues" element={<VenueCatalog />} /> */}
            {/* <Route path="/events" element={<EventListPage />} /> */}
            {/* Add /vendors, /signup, etc. as you build them */}
        </Routes>
    );
};

export default AppRoutes;