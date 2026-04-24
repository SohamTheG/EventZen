package com.gatewayapi.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

// The 4 crucial imports
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

@Configuration
public class GatewayRoutingConfig {

    @Bean
    public RouterFunction<ServerResponse> authServiceRoute() {
        return route("user-auth-service")
                .route(path("/auth/**").or(path("/user/**")).or(path("/api/attendees/**")), http()) // <-- http() is now
                                                                                                    // empty
                .before(uri("http://user-auth-service:9000")) // <-- The target URL goes here now
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> venueVendorRoute() {
        return route("venue-vendor-service")
                .route(path("/api/venues/**").or(path("/api/vendors/**")), http())
                .before(uri("http://venue-vendor-service:9001"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> eventsBookingRoute() {
        return route("events-booking-service")
                .route(path("/api/events/**").or(path("/api/bookings/**")), http())
                .before(uri("http://events-booking-service:9002"))
                .build();
    }
}