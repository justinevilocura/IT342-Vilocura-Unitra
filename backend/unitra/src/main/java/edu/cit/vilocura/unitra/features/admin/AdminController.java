package edu.cit.vilocura.unitra.features.admin;

import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.auth.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserService userService;

    // Get all pending SME requests
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingRequests() {
        List<User> pending = userService.getPendingSmes();
        System.out.println("Fetching pending requests. Found: " + pending.size());
        return ResponseEntity.ok(pending);
    }

    // Approve an SME
    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approveSme(@PathVariable Long id) {
        try {
            userService.updateUserStatus(id, "APPROVED");
            return ResponseEntity.ok("User approved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error approving user: " + e.getMessage());
        }
    }

    // Decline an SME
    @PostMapping("/decline/{id}")
    public ResponseEntity<String> declineSme(@PathVariable Long id) {
        try {
            userService.updateUserStatus(id, "DECLINED");
            return ResponseEntity.ok("User declined successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error declining user: " + e.getMessage());
        }
    }
}


