package com.project.events_bookings_api.services;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
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

    // Inject Redis
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Transactional
    public Booking createBooking(Booking booking) {
        String lockKey = "lock:venue:" + booking.getVenueId() + ":date:" + booking.getEventDate().toString();
        Boolean lockAcquired = redisTemplate.opsForValue().setIfAbsent(lockKey, "LOCKED", Duration.ofMinutes(5));

        // BYPASSED: Redis Lock Check
        // if (Boolean.FALSE.equals(lockAcquired)) {
        //     throw new IllegalStateException("Already booked for this day.");
        // }

        try {
            // BYPASSED: Database Conflict Check
            // boolean isAlreadyBooked = bookingRepo.existsConflict(booking.getVenueId(), booking.getEventDate());
            // if (isAlreadyBooked) {
            //     throw new IllegalStateException("Already booked for this day.");
            // }

            booking.setStatus(BookingStatus.PENDING);

            // BYPASSED: Database Save (so MySQL doesn't crash from duplicates)
            // Booking savedBooking = bookingRepo.save(booking);

            // Send the raw booking straight to RabbitMQ!
            rabbitTemplate.convertAndSend(RabbitConfig.QUEUE_NAME, booking);

            return booking;

        } finally {
            redisTemplate.delete(lockKey);
        }
    }

    public Booking updateStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepo.findById(id).orElseThrow();
        booking.setStatus(status);
        return bookingRepo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public List<Booking> getBookingsByHost(Long hostId) {
        return bookingRepo.findByEventHostId(hostId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    // ----------------------FOR ADMIN------------------
    public List<Booking> getAllBookingsForAdmin() {
        return bookingRepo.findAll();
    }

    public List<Booking> getAllApprovedBookings() {
        return bookingRepo.findByStatus(BookingStatus.APPROVED);
    }

    @Transactional
    public Booking approveBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.APPROVED);

        if (booking.getEvent() != null) {
            booking.getEvent().setPublic(true);
        }

        return bookingRepo.save(booking);
    }

    @Transactional
    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.REJECTED);
        return bookingRepo.save(booking);
    }
}