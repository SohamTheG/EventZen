package com.project.events_bookings_api.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.events_bookings_api.models.Booking;
import com.project.events_bookings_api.models.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Custom query to find bookings by hostId for the customer dashboard
    List<Booking> findByEventHostId(Long hostId);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.venueId = :venueId AND b.eventDate = :eventDate AND b.status IN ('APPROVED', 'PENDING')")
    boolean existsConflict(@Param("venueId") Long venueId, @Param("eventDate") LocalDate eventDate);
}