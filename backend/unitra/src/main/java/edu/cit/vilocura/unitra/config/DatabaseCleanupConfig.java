package edu.cit.vilocura.unitra.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseCleanupConfig {

    @Bean
    public CommandLineRunner cleanupDb(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE users DROP COLUMN IF EXISTS name");
                jdbcTemplate.execute("ALTER TABLE users DROP COLUMN IF EXISTS password");
                jdbcTemplate.execute("ALTER TABLE users DROP COLUMN IF EXISTS role");
                System.out.println("Cleaned up accidental duplicate columns in users table.");

                // Seed roles if not present
                jdbcTemplate.execute("INSERT INTO roles (id, role_name) VALUES (1, 'SME') ON CONFLICT (id) DO NOTHING;");
                jdbcTemplate.execute("INSERT INTO roles (id, role_name) VALUES (2, 'CONSUMER') ON CONFLICT (id) DO NOTHING;");
                jdbcTemplate.execute("INSERT INTO roles (id, role_name) VALUES (3, 'ADMIN') ON CONFLICT (id) DO NOTHING;");
                System.out.println("Seeded roles table.");
            } catch (Exception e) {
                System.out.println("Could not drop columns: " + e.getMessage());
            }
        };
    }
}
