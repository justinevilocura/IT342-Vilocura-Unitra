package edu.cit.vilocura.unitra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class UnitraApplication {

    public static void main(String[] args) {
        SpringApplication.run(UnitraApplication.class, args);
    }

    @Bean
    public CommandLineRunner updateDatabaseSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Supabase previously created avatar_url as VARCHAR(255).
                // We must alter it to TEXT to support long base64 image strings.
                jdbcTemplate.execute("ALTER TABLE profiles ALTER COLUMN avatar_url TYPE text;");

                // Add likes column to posts if it doesn't exist
                jdbcTemplate.execute("ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;");

                System.out.println("Database schema updated successfully!");
            } catch (Exception e) {
                System.out.println("Note: Database schema alter skipped or already applied.");
            }
        };
    }
}
