package com.project.events_bookings_api.models;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL) // Add this CascadeType.ALL
    @JoinColumn(name = "event_id")
    private Event event;

    private Long venueId; // Logical ID from your Node.js Service
    private LocalDate eventDate;

    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Booking [id=" + id + ", event=" + event + ", venueId=" + venueId + ", eventDate=" + eventDate
                + ", status=" + status + "]";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING; // PENDING, APPROVED, REJECTED

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}