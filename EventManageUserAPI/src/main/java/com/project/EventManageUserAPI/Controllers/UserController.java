package com.project.EventManageUserAPI.Controllers;

import com.project.EventManageUserAPI.Services.UserService;
import com.project.EventManageUserAPI.models.User;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController

// @CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    // --------------------------------------- routes for CRUD
    // Operations-----------------------------
    @GetMapping("/user/{id}")
    public ResponseEntity<?> GetUser(@PathVariable Long id) {
        // process GET request
        return userService.getUser(id);
    }

    // UserController.java (Port 9000)
    @GetMapping("/auth/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers(); // Ensure this exists in your UserService
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> DeleteUser(@PathVariable Long id) {
        return userService.DeleteUser(id); // Changed from String
    }

    @PostMapping("/user")
    public ResponseEntity<?> AddUser(@RequestBody User user) {
        return userService.addUser(user); // Changed from String
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> UpdateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.UpdateUser(id, user); // Changed from String
    }

}
