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
    public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String password) {
        try {
            User user = userService.loginUser(email, password);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Login successful. Welcome " + user.getName());
            response.put("userId", user.getId());
            response.put("status", user.getStatus());
            response.put("roleId", user.getRoleId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Email Verification Endpoint
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        try {
            userService.verifyEmail(token);
            String successHtml = 
                "<html><head><style>" +
                "body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #ffffff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }" +
                ".card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 48px; text-align: center; max-width: 400px; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }" +
                ".icon { font-size: 64px; margin-bottom: 24px; }" +
                "h1 { font-size: 28px; font-weight: 800; margin-bottom: 16px; }" +
                "p { color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 32px; }" +
                ".btn { background: #ffffff; color: #0a0a0a; padding: 12px 32px; border-radius: 50px; font-weight: 600; text-decoration: none; display: inline-block; transition: transform 0.2s; }" +
                ".btn:hover { transform: translateY(-2px); }" +
                "</style></head><body>" +
                "<div class='card'>" +
                "<h1>Email Verified!</h1>" +
                "<p>Your email has been successfully verified. You can now access your account and start your journey.</p>" +
                "<a href='http://localhost:5173/login' class='btn'>Go to Login</a>" +
                "</div>" +
                "</body></html>";
            return ResponseEntity.ok().header("Content-Type", "text/html").body(successHtml);
        } catch (IllegalArgumentException e) {
            String errorHtml = 
                "<html><head><style>" +
                "body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #ffffff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }" +
                ".card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 48px; text-align: center; max-width: 400px; }" +
                "h1 { font-size: 28px; font-weight: 800; margin-bottom: 16px; }" +
                "p { color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 32px; }" +
                ".btn { background: rgba(255,255,255,0.1); color: #ffffff; padding: 12px 32px; border-radius: 50px; font-weight: 600; text-decoration: none; display: inline-block; }" +
                "</style></head><body>" +
                "<div class='card'>" +
                "<h1>Verification Failed</h1>" +
                "<p>" + e.getMessage() + "</p>" +
                "<a href='http://localhost:5173/register' class='btn'>Back to Register</a>" +
                "</div>" +
                "</body></html>";
            return ResponseEntity.badRequest().header("Content-Type", "text/html").body(errorHtml);
        }
    }
}