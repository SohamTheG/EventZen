package com.project.events_bookings_api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.events_bookings_api.config.RabbitConfig;
import com.project.events_bookings_api.models.Booking;
import com.project.events_bookings_api.models.BookingStatus;
import com.project.events_bookings_api.repository.BookingRepository;

import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepo.save(booking);

        rabbitTemplate.convertAndSend(RabbitConfig.QUEUE_NAME, savedBooking);

        return savedBooking;
    }

    public Booking updateStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepo.findById(id).orElseThrow();
        booking.setStatus(status);
        // If approved, you could trigger logic here to notify the user
        return bookingRepo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public List<Booking> getBookingsByHost(Long hostId) {
        return bookingRepo.findByEventHostId(hostId);
    }

    // ----------------------FOR ADMIN------------------

    // GET /admin/bookings
    public List<Booking> getAllBookingsForAdmin() {
        return bookingRepo.findAll();
    }

    public List<Booking> getAllApprovedBookings() {
        return bookingRepo.findByStatus(BookingStatus.APPROVED);
    }

    // PUT /admin/bookings/{id}/approve
    @Transactional
    public Booking approveBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.APPROVED);

        // Logical link: Once approved, the event can be seen by others
        if (booking.getEvent() != null) {
            booking.getEvent().setPublic(true);
        }

        return bookingRepo.save(booking);
    }

    // PUT /admin/bookings/{id}/reject
    @Transactional
    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.REJECTED);
        return bookingRepo.save(booking);
    }
}