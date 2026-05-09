package edu.cit.vilocura.unitra.config;

import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            String adminEmail = "admin@cit.edu";
            Optional<User> adminOptional = userRepository.findByEmail(adminEmail);

            if (adminOptional.isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                admin.setRoleId(3L); // Assuming 3L is ADMIN roleId as per previous inference
                admin.setStatus("APPROVED");
                admin.setEmailVerified(true);

                userRepository.save(admin);
                System.out.println("Admin user seeded automatically.");
            }
        };
    }
}

