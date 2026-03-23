package com.project.EventManageUserAPI.Services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.EventManageUserAPI.models.Attendee;
import com.project.EventManageUserAPI.Repositories.attendeesRepo;
import com.project.EventManageUserAPI.exceptions.DuplicateResourceException;
import com.project.EventManageUserAPI.exceptions.ResourceNotFoundException;

@Service
public class AttendeeServices {

    @Autowired
    private attendeesRepo attendeeRepo;

    // 1. Logic to prevent duplicate registrations
    public Attendee registerUniqueAttendee(Attendee attendee) {
        boolean exists = attendeeRepo.existsByUserIdAndEventId(
                attendee.getUser().getId(),
                attendee.getEventId());

        if (exists) {
            throw new DuplicateResourceException("User is already registered for this event");
        }

        return attendeeRepo.save(attendee);
    }

    // 2. Query for Admin Guest List
    public List<Attendee> getAttendeesByEvent(Integer eventId) {
        return attendeeRepo.findByEventId(eventId);
    }

    public List<Attendee> getAllAttendees() {
        return attendeeRepo.findAll();
    }

    public Optional<Attendee> getAttendeeById(Long id) {
        return attendeeRepo.findById(id);
    }

    public void deleteAttendee(Long id) {
        if (!attendeeRepo.existsById(id)) {
            throw new ResourceNotFoundException("Attendee not found with id: " + id);
        }
        attendeeRepo.deleteById(id);
    }
}