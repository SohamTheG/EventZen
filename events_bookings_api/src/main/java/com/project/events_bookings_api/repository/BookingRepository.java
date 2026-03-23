package com.project.events_bookings_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.events_bookings_api.models.Booking;
import com.project.events_bookings_api.models.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Custom query to find bookings by hostId for the customer dashboard
    List<Booking> findByEventHostId(Long hostId);

    List<Booking> findByStatus(BookingStatus status);
}