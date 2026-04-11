package edu.cit.vilocura.unitra.controller;

import edu.cit.vilocura.unitra.entity.User;
import edu.cit.vilocura.unitra.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private UserService userService;

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String email, @RequestParam String password) {
        try {
            User user = userService.loginUser(email, password);
            return ResponseEntity.ok("Login successful. Welcome " + user.getName());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }
}