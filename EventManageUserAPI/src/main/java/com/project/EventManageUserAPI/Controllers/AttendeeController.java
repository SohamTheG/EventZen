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

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    // 3. Get all attendees for a SPECIFIC event (For Admin Guest List & Host Management)
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getAttendeesByEvent(
            @PathVariable Integer eventId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        
        if ("ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(attendeeServices.getAttendeesByEvent(eventId));
        }

        // Check if the current user is the host of this event
        try {
            String bookingApiUrl = "http://events-booking-service:9002/api/bookings/" + eventId;
            com.project.EventManageUserAPI.models.BookingDTO booking = restTemplate.getForObject(bookingApiUrl, com.project.EventManageUserAPI.models.BookingDTO.class);
            
            if (booking == null || booking.getEvent() == null || !booking.getEvent().getHostId().toString().equals(userIdStr)) {
                return ResponseEntity.status(403).body("You are not authorized to view attendees for this event.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying event authorization.");
        }

        return ResponseEntity.ok(attendeeServices.getAttendeesByEvent(eventId));
    }

    @GetMapping("/all")
    public List<Attendee> getAllAttendees() {
        return attendeeServices.getAllAttendees();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendee(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if ("ADMIN".equalsIgnoreCase(role)) {
            attendeeServices.deleteAttendee(id);
            return ResponseEntity.ok().build();
        }

        Attendee attendee = attendeeServices.getAttendeeById(id).orElse(null);
        if (attendee == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if the current user is the host of the event the attendee is registered for
        try {
            String bookingApiUrl = "http://events-booking-service:9002/api/bookings/" + attendee.getEventId();
            com.project.EventManageUserAPI.models.BookingDTO booking = restTemplate.getForObject(bookingApiUrl, com.project.EventManageUserAPI.models.BookingDTO.class);
            
            if (booking == null || booking.getEvent() == null || !booking.getEvent().getHostId().toString().equals(userIdStr)) {
                return ResponseEntity.status(403).body("You are not authorized to remove attendees for this event.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying event authorization.");
        }

        attendeeServices.deleteAttendee(id);
        return ResponseEntity.ok().build();
    }

    // PUBLIC ENDPOINT: Scanned by phone cameras to load the digital ticket UI
    @GetMapping("/ticket/view/{uuid}")
    public ResponseEntity<Attendee> viewDigitalTicket(@PathVariable String uuid) {
        Attendee ticketData = attendeeServices.getTicketByUUID(uuid);
        return ResponseEntity.ok(ticketData);
    }
}