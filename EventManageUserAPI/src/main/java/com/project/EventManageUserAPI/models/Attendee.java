package com.project.EventManageUserAPI.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "attendees")
public class Attendee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id")
    private Integer eventId;

    private String status;

    // A unique, unguessable string for this specific purchase
    @Column(unique = true)
    private String ticketIdentifier;

    // Stores the QR code image natively as a Base64 string
    @Column(columnDefinition = "TEXT")
    private String qrCodeBase64;

    // your Getters and Setters for both!
    public String getTicketIdentifier() {
        return ticketIdentifier;
    }

    public void setTicketIdentifier(String ticketIdentifier) {
        this.ticketIdentifier = ticketIdentifier;
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
    }

    // CHANGE: Link to the User object instead of just an ID
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    // Default to 1 so old data doesn't break
    @Column(nullable = false, columnDefinition = "int default 1")
    private Integer quantity = 1;

    // Make sure to add your getter and setter:
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "Attendee [id=" + id + ", eventId=" + eventId + ", status=" + status + ", user=" + user + ", quantity="
                + quantity + "]";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Getters and Setters

}