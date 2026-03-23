package com.project.events_bookings_api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.events_bookings_api.models.Event;
import com.project.events_bookings_api.repository.EventRepository;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepo;

    public Event createEvent(Event event) {
        return eventRepo.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepo.findById(id).orElse(null);
    }

    public void deleteEvent(Long id) {
        eventRepo.deleteById(id);
    }
}