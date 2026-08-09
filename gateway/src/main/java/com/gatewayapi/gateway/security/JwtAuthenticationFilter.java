package com.gatewayapi.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // MUST match the exact secret from your Auth Service!
    private final String SECRET = "EventZenSuperSecretKeyThatIsVeryLongAndSecure123!";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 🚨 THE FIX: Let CORS Preflight requests pass through without a token!
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // 1. Let public routes pass through without a token
        if (path.startsWith("/auth/") || path.startsWith("/api/public/") || path.startsWith("/api/venues")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Check for the Authorization header
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Missing or Invalid Authorization Header");
            return;
        }

        // 3. Extract the token
        String token = authHeader.substring(7);
        HeaderMapRequestWrapper wrapper = null;
        try {
            // 4. Validate and decode the token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 5. Extract the data we put in earlier
            String userId = String.valueOf(claims.get("userId"));
            String role = (String) claims.get("role");

            // 6. Mutate the request to add X-User headers for the microservices
            wrapper = new HeaderMapRequestWrapper(request);
            wrapper.addHeader("X-User-Id", userId);
            wrapper.addHeader("X-User-Role", role);

            // Forward the modified request to the destination microservice

        } catch (Exception e) {
            // 🚨 ADD THESE TWO LINES SO WE CAN SEE THE EXACT ERROR:
            System.out.println("🚨 JWT FAILURE REASON: " + e.getMessage());
            e.printStackTrace();

            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Token is expired or tampered with!");
        }
        filterChain.doFilter(wrapper, response);
    }

    // --- Helper class to mutate HTTP Headers in Spring MVC ---
    private static class HeaderMapRequestWrapper extends HttpServletRequestWrapper {
        private final java.util.Map<String, String> customHeaders = new java.util.HashMap<>();

        public HeaderMapRequestWrapper(HttpServletRequest request) {
            super(request);
        }

        public void addHeader(String name, String value) {
            this.customHeaders.put(name, value);
        }

        @Override
        public String getHeader(String name) {
            String headerValue = customHeaders.get(name);
            if (headerValue != null)
                return headerValue;
            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            List<String> names = Collections.list(super.getHeaderNames());
            names.addAll(customHeaders.keySet());
            return Collections.enumeration(names);
        }

        // 🚨 THE MISSING PIECE THAT CAUSED THE 500 ERROR 🚨
        @Override
        public Enumeration<String> getHeaders(String name) {
            List<String> values = new java.util.ArrayList<>();
            if (customHeaders.containsKey(name)) {
                values.add(customHeaders.get(name));
            }
            Enumeration<String> superHeaders = super.getHeaders(name);
            if (superHeaders != null) {
                values.addAll(Collections.list(superHeaders));
            }
            return Collections.enumeration(values);
        }
    }
}