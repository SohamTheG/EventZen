package com.project.EventManageUserAPI.Controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.EventManageUserAPI.Services.AttendeeServices;
import com.project.EventManageUserAPI.models.Attendee;

@RestController
@RequestMapping("/api/attendees")
// @CrossOrigin(origins = "http://localhost:3000") // 1. Allow React to connect
public class AttendeeController {

    @Autowired
    private AttendeeServices attendeeServices;

    // 2. The specific registration endpoint for the "Attend" button
    @PostMapping("/register")
    public ResponseEntity<?> registerAttendee(@RequestBody Attendee attendee) {
        try {
            Attendee saved = attendeeServices.registerUniqueAttendee(attendee);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            // Returns 400 if user is already registered
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Get all attendees for a SPECIFIC event (For Admin Guest List)
    @GetMapping("/event/{eventId}")
    public List<Attendee> getAttendeesByEvent(@PathVariable Integer eventId) {
        return attendeeServices.getAttendeesByEvent(eventId);
    }

    @GetMapping("/all")
    public List<Attendee> getAllAttendees() {
        return attendeeServices.getAllAttendees();
    }

    @DeleteMapping("/{id}")
    public void deleteAttendee(@PathVariable Long id) {
        attendeeServices.deleteAttendee(id);
    }
}