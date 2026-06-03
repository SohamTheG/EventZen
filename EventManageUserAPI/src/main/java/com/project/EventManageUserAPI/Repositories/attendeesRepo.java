package com.project.EventManageUserAPI.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.EventManageUserAPI.models.Attendee;

public interface attendeesRepo extends org.springframework.data.jpa.repository.JpaRepository<Attendee, Long> {
    boolean existsByUserIdAndEventId(Long userId, Integer eventId);

    // Note: Use 'user.id' to traverse the ManyToOne relationship

    // Get the list of all attendees for a specific event
    List<Attendee> findByEventId(Integer eventId);

    @Query("SELECT COALESCE(SUM(a.quantity), 0) FROM Attendee a WHERE a.eventId = :eventId")
    Integer getTotalTicketsSoldForEvent(@Param("eventId") Integer eventId);

    Optional<Attendee> findByTicketIdentifier(String ticketIdentifier);
}
