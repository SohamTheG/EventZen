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
    public ResponseEntity<Attendee> registerAttendee(@RequestBody Attendee attendee) {
        // No try-catch needed! If it fails, the GlobalExceptionHandler intercepts it.
        Attendee saved = attendeeServices.registerUniqueAttendee(attendee);
        return ResponseEntity.ok(saved);
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

    // PUBLIC ENDPOINT: Scanned by phone cameras to load the digital ticket UI
    @GetMapping("/ticket/view/{uuid}")
    public ResponseEntity<Attendee> viewDigitalTicket(@PathVariable String uuid) {
        Attendee ticketData = attendeeServices.getTicketByUUID(uuid);
        return ResponseEntity.ok(ticketData);
    }
}