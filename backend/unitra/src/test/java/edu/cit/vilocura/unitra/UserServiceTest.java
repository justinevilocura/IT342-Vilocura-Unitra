package edu.cit.vilocura.unitra;

import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import edu.cit.vilocura.unitra.features.auth.UserService;
import edu.cit.vilocura.unitra.features.auth.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 1. AUTHENTICATION & AUTHORIZATION TESTS

    @Test
    void testConsumerRegistrationSuccess() {
        User user = new User();
        user.setEmail("consumer@example.com");
        user.setPassword("StrongPass123!");
        user.setRole(User.Role.CONSUMER);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User savedUser = userService.registerUser(user);

        assertNotNull(savedUser);
        assertEquals(2L, savedUser.getRoleId());
        assertFalse(savedUser.isEmailVerified());
        assertNotNull(savedUser.getVerificationToken());
        verify(emailService, times(1)).sendVerificationEmail(anyString(), anyString());
    }

    @Test
    void testSmeRegistrationSuccess() {
        User smeUser = new User();
        smeUser.setEmail("sme@cit.edu");
        smeUser.setPassword("StrongPass123!");
        smeUser.setRole(User.Role.SME);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User savedUser = userService.registerUser(smeUser);

        assertEquals(1L, savedUser.getRoleId());
    }

    @Test
    void testRegistrationRejectsDuplicateEmail() {
        User user = new User();
        user.setEmail("taken@example.com");

        when(userRepository.findByEmail("taken@example.com")).thenReturn(Optional.of(user));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(user);
        });

        assertEquals("Email is already taken", exception.getMessage());
    }

    @Test
    void testLoginValidCredentials() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword(new BCryptPasswordEncoder().encode("correctPassword"));
        user.setEmailVerified(true);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        User loggedInUser = userService.loginUser("test@example.com", "correctPassword");

        assertNotNull(loggedInUser);
        assertEquals("test@example.com", loggedInUser.getEmail());
    }

    @Test
    void testLoginInvalidCredentials() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword(new BCryptPasswordEncoder().encode("correctPassword"));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> {
            userService.loginUser("test@example.com", "wrongPassword");
        });
    }

    @Test
    void testLoginUnverifiedEmailFails() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword(new BCryptPasswordEncoder().encode("correctPassword"));
        user.setEmailVerified(false);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> {
            userService.loginUser("test@example.com", "correctPassword");
        });
    }

    // 2. SME VERIFICATION WORKFLOW TESTS

    @Test
    void testAdminViewPendingSmes() {
        User sme1 = new User();
        sme1.setStatus("PENDING");
        sme1.setRoleId(1L);

        when(userRepository.findByRoleIdAndStatus(1L, "PENDING")).thenReturn(List.of(sme1));

        List<User> pending = userService.getPendingSmes();
        assertEquals(1, pending.size());
        assertEquals("PENDING", pending.get(0).getStatus());
    }

    @Test
    void testAdminApproveSme() {
        User sme = new User();
        sme.setId(10L);
        sme.setStatus("PENDING");

        when(userRepository.findById(10L)).thenReturn(Optional.of(sme));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = userService.updateUserStatus(10L, "APPROVED");

        assertEquals("APPROVED", updatedUser.getStatus());
    }

    @Test
    void testAdminDeclineSme() {
        User sme = new User();
        sme.setId(11L);
        sme.setStatus("PENDING");

        when(userRepository.findById(11L)).thenReturn(Optional.of(sme));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = userService.updateUserStatus(11L, "DECLINED");

        assertEquals("DECLINED", updatedUser.getStatus());
    }
}
