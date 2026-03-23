package com.project.events_bookings_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.events_bookings_api.models.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}