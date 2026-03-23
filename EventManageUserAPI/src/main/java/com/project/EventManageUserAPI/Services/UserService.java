package com.project.EventManageUserAPI.Services;

import com.project.EventManageUserAPI.models.User;
import com.project.EventManageUserAPI.Repositories.UserRepo;
import com.project.EventManageUserAPI.exceptions.DuplicateResourceException;
import com.project.EventManageUserAPI.exceptions.ResourceNotFoundException;
import com.project.EventManageUserAPI.exceptions.InvalidInputException;
import com.project.EventManageUserAPI.exceptions.InternalServerException;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    // 1. Add User with Duplicate and Input Validation
    public ResponseEntity<?> addUser(User user) {
        // Basic Input Validation
        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            throw new InvalidInputException("A valid email address is required.");
        }

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("User with email " + user.getEmail() + " already exists.");
        }

        try {
            userRepo.save(user);
            return ResponseEntity.ok("User added successfully.");
        } catch (Exception e) {
            throw new InternalServerException("Database error: Could not save the new user.");
        }
    }

    // 2. Get Single User with Not Found Exception
    public ResponseEntity<?> getUser(Long id) {
        return userRepo.findById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // 3. Delete User with Not Found Exception
    public ResponseEntity<?> DeleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new ResourceNotFoundException("User with id " + id + " does not exist.");
        }

        try {
            userRepo.deleteById(id);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (Exception e) {
            throw new InternalServerException("Database error: Could not delete user with id: " + id);
        }
    }

    // 4. Update User with Transactional and Input Guards
    @Transactional
    public ResponseEntity<?> UpdateUser(Long id, User incomingUser) {
        return userRepo.findById(id).map(existingUser -> {

            // Safety Log (Matches your previous working version)
            System.out.println("Updating user ID: " + id);
            System.out.println("Incoming Name Data: " + incomingUser.getName());

            // Validate email if it's being updated
            if (incomingUser.getEmail() != null && incomingUser.getEmail().isEmpty()) {
                throw new InvalidInputException("Email cannot be updated to an empty value.");
            }

            // --- Preserved Working Merge Logic ---
            if (incomingUser.getName() != null && !incomingUser.getName().isEmpty()) {
                existingUser.setName(incomingUser.getName());
            }

            if (incomingUser.getEmail() != null) {
                existingUser.setEmail(incomingUser.getEmail());
            }

            if (incomingUser.getPassword() != null && !incomingUser.getPassword().isEmpty()) {
                // If you use BCrypt, wrap this in passwordEncoder.encode()
                existingUser.setPassword(incomingUser.getPassword());
            }
            // -------------------------------------

            try {
                userRepo.save(existingUser);
                return ResponseEntity.ok("User updated successfully.");
            } catch (Exception e) {
                throw new InternalServerException("Failed to save changes to the database for user id: " + id);
            }

        }).orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " does not exist."));
    }

    // 5. Get All Users
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}