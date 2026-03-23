package com.project.EventManageUserAPI.Repositories;

import java.util.List;

import com.project.EventManageUserAPI.models.Attendee;

public interface attendeesRepo extends org.springframework.data.jpa.repository.JpaRepository<Attendee, Long> {
    boolean existsByUserIdAndEventId(Long userId, Integer eventId);

    // Note: Use 'user.id' to traverse the ManyToOne relationship

    // Get the list of all attendees for a specific event
    List<Attendee> findByEventId(Integer eventId);
}
