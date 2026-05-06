package edu.cit.vilocura.unitra.service;

import edu.cit.vilocura.unitra.entity.User;
import edu.cit.vilocura.unitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional; // Corrected import for Jakarta

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Check if email is already taken
    public boolean isEmailTaken(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }

    // Register user
    @Transactional
    public User registerUser(User user) {
        System.out.println("Registering user: " + user.getEmail() + " with role: " + user.getRole());
        if (isEmailTaken(user.getEmail())) {
            throw new IllegalArgumentException("Email is already taken");
        }
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword())); // Encrypt password using BCrypt
        
        // Setup verification
        user.setEmailVerified(false);
        String token = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(token);
        
        // Send actual verification email
        emailService.sendVerificationEmail(user.getEmail(), token);
        
        if (user.getRole() == User.Role.SME) {
            System.out.println("Assigning Role ID 1 (SME)");
            user.setRoleId(1L);
        } else if (user.getRole() == User.Role.CONSUMER) {
            System.out.println("Assigning Role ID 2 (CONSUMER)");
            user.setRoleId(2L);
        } else {
            System.out.println("Assigning Role ID 3 (ADMIN/UNKNOWN)");
            user.setRoleId(3L);
        }
        return userRepository.save(user);
    }

    // Verify Email
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));
        
        user.setEmailVerified(true);
        user.setVerificationToken(null); // Clear token after verification
        userRepository.save(user);
    }

    // Login user
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!new BCryptPasswordEncoder().matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            throw new IllegalArgumentException("Verify your Email");
        }

        return user; // Successful login
    }

    public java.util.List<User> getPendingSmes() {
        return userRepository.findByRoleIdAndStatus(1L, "PENDING");
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setStatus(status);
        return userRepository.save(user);
    }
}