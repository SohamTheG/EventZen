package com.project.EventManageUserAPI.models;

public class BookingDTO {
    private Long venueId;
    private EventDTO event;

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public EventDTO getEvent() {
        return event;
    }

    public void setEvent(EventDTO event) {
        this.event = event;
    }

    public static class EventDTO {
        private Long hostId;

        public Long getHostId() {
            return hostId;
        }

        public void setHostId(Long hostId) {
            this.hostId = hostId;
        }
    }
}