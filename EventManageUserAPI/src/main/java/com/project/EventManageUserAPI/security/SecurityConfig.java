package com.project.EventManageUserAPI.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) // Enable CORS within Security
                .csrf(csrf -> csrf.disable()) // Disable CSRF for development
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // Allow register/login
                        .requestMatchers("/api/attendees/**").permitAll() // ALLOW ATTENDEES
                        .requestMatchers("/auth/all").permitAll() // ALLOW to fetch all users (not advised)
                        .requestMatchers("/user/**").permitAll() // 3. Permit DELETE/PUT on user paths
                        .anyRequest().authenticated());
        return http.build();
    }
}