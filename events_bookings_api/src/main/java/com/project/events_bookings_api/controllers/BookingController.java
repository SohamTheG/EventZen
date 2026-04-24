package com.project.events_bookings_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.events_bookings_api.models.Booking;
import com.project.events_bookings_api.models.BookingStatus;
import com.project.events_bookings_api.services.BookingService;

@RestController
@RequestMapping("/api/bookings")
// @CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    // Customer: Request a booking
    @PostMapping
    public Booking requestBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/customer/{hostId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable Long hostId) {
        List<Booking> bookings = bookingService.getBookingsByHost(hostId);
        return ResponseEntity.ok(bookings);
    }

    // Customer: Cancel booking
    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return bookingService.updateStatus(id, BookingStatus.CANCELLED);
    }

    // ADMIN ONLY ENDPOINTS
    @GetMapping("/admin")
    public ResponseEntity<List<Booking>> getAdminBookings() {
        return ResponseEntity.ok(bookingService.getAllBookingsForAdmin());
    }

    // Get all bookings for the Admin Dashboard
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookingsForAdmin());
    }

    // In BookingController.java
    @GetMapping("/public")
    public List<Booking> getPublicEvents() {
        // You'll need to add findByStatus(APPROVED) or similar to your repository
        return bookingService.getAllApprovedBookings();
    }

    // 2. Approve a booking
    @PutMapping("/admin/{id}/approve")
    public ResponseEntity<Booking> approve(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    // 3. Reject a booking
    @PutMapping("/admin/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    // --------------FOR ADMIN-------------------

}