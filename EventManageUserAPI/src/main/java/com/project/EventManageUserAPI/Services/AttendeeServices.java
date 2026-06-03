package com.project.EventManageUserAPI.Services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.EventManageUserAPI.models.Attendee;
import com.project.EventManageUserAPI.models.BookingDTO;
import com.project.EventManageUserAPI.models.VenueDTO;
import com.project.EventManageUserAPI.Repositories.attendeesRepo;
import com.project.EventManageUserAPI.exceptions.DuplicateResourceException;
import com.project.EventManageUserAPI.exceptions.ResourceNotFoundException;

@Service
public class AttendeeServices {

    @Autowired
    private attendeesRepo attendeeRepo;
    @Autowired
    private QRCodeService qrCodeService;

    // 1. Logic to prevent duplicate registrations
    @Autowired
    private RestTemplate restTemplate;

    // The Orchestrator: Prevents duplicates AND enforces venue capacity
    public Attendee registerUniqueAttendee(Attendee attendee) {

        // 1. Check for Duplicate Registration
        boolean exists = attendeeRepo.existsByUserIdAndEventId(
                attendee.getUser().getId(),
                attendee.getEventId());

        if (exists) {
            throw new DuplicateResourceException("User is already registered for this event");
        }

        // 1. Ensure the user provided a valid quantity (default to 1 if they didn't)
        int requestedQty = (attendee.getQuantity() != null && attendee.getQuantity() > 0)
                ? attendee.getQuantity()
                : 1;

        // 2. The New Headcount: Add up all the quantities, not the rows
        int currentHeadcount = attendeeRepo.getTotalTicketsSoldForEvent(attendee.getEventId());

        // 3. Ask Booking API for the Venue ID
        // Note: Using the internal Docker network names and ports
        String bookingApiUrl = "http://events-booking-service:9002/api/bookings/" + attendee.getEventId();
        BookingDTO bookingData = restTemplate.getForObject(bookingApiUrl, BookingDTO.class);

        if (bookingData == null || bookingData.getVenueId() == null) {
            throw new RuntimeException("Could not verify event details.");
        }

        // 4. Ask Venue API (Node.js) for the Max Capacity
        String venueApiUrl = "http://venue-vendor-service:9001/api/venues/" + bookingData.getVenueId();
        VenueDTO venueData = restTemplate.getForObject(venueApiUrl, VenueDTO.class);

        if (venueData == null || venueData.getCapacity() == null) {
            throw new RuntimeException("Could not verify venue capacity.");
        }

        // check condition for capacity
        if (currentHeadcount + requestedQty > venueData.getCapacity()) {
            int ticketsLeft = venueData.getCapacity() - currentHeadcount;
            throw new RuntimeException(
                    "Cannot book " + requestedQty + " tickets. Only " + ticketsLeft + " seats remaining.");
        }

        // 5. The Capacity Check Passed! Generate the Digital Ticket
        try {
            // Create an unguessable UUID for the ticket
            String uniqueTicketId = java.util.UUID.randomUUID().toString();
            attendee.setTicketIdentifier(uniqueTicketId);

            // THE FIX: Make it a URL pointing to your React frontend!
            // (Use localhost for now, we will change it to your actual domain in
            // production)
            String frontendDomain = "http://localhost:3000";
            String qrData = frontendDomain + "/ticket/view/" + uniqueTicketId;

            // Tell the engine to draw the image
            String base64Image = qrCodeService.generateQRCodeImage(qrData);
            attendee.setQrCodeBase64(base64Image);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Payment successful, but failed to generate digital ticket. Please contact support.");
        }

        // 6. If all checks pass, save the attendee
        attendee.setQuantity(requestedQty);
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

    // Fetch full ticket details for the QR Code scanner
    public Attendee getTicketByUUID(String ticketIdentifier) {
        return attendeeRepo.findByTicketIdentifier(ticketIdentifier)
                .orElseThrow(() -> new RuntimeException("Invalid or Fake Ticket!"));
    }
}