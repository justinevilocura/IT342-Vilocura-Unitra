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

    // Check if email is already taken
    public boolean isEmailTaken(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }

    // Register user
    @Transactional
    public User registerUser(User user) {
        if (isEmailTaken(user.getEmail())) {
            throw new IllegalArgumentException("Email is already taken");
        }
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword())); // Encrypt password using BCrypt
        if (user.getRole() == User.Role.SME) {
            user.setRoleId(1L);
        } else if (user.getRole() == User.Role.CONSUMER) {
            user.setRoleId(2L);
        } else {
            user.setRoleId(3L);
        }
        return userRepository.save(user);
    }

    // Login user
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (new BCryptPasswordEncoder().matches(password, user.getPassword())) {
            return user; // Successful login
        } else {
            throw new IllegalArgumentException("Invalid email or password");
        }
    }
}