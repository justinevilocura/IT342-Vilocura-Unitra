package edu.cit.vilocura.unitra.controller;

import edu.cit.vilocura.unitra.entity.User;
import edu.cit.vilocura.unitra.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            edu.cit.vilocura.unitra.dto.UserProfileDTO dto = userService.getUserProfile(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody edu.cit.vilocura.unitra.dto.UserProfileDTO updatedData) {
        try {
            edu.cit.vilocura.unitra.dto.UserProfileDTO savedDto = userService.updateUserProfile(id, updatedData);
            return ResponseEntity.ok(savedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
