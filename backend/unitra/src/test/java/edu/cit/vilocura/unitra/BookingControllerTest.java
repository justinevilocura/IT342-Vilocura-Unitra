package edu.cit.vilocura.unitra;

import edu.cit.vilocura.unitra.features.bookings.Booking;
import edu.cit.vilocura.unitra.features.bookings.BookingController;
import edu.cit.vilocura.unitra.features.bookings.BookingRepository;
import edu.cit.vilocura.unitra.features.marketplace.Product;
import edu.cit.vilocura.unitra.features.marketplace.ProductRepository;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingControllerTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingController bookingController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 4. BOOKING SYSTEM TESTS

    @Test
    void testConsumerCanBookItem() {
        Booking booking = new Booking();
        booking.setProductId(1L);
        booking.setConsumerId(2L); // Different user

        Product product = new Product();
        product.setId(1L);
        product.setUserId(1L); // SME
        product.setStatus("Available");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> {
            Booking b = i.getArgument(0);
            b.setId(10L);
            return b;
        });

        ResponseEntity<?> response = bookingController.createBooking(booking);

        assertEquals(200, response.getStatusCodeValue());
        Booking savedBooking = (Booking) response.getBody();
        assertNotNull(savedBooking);
        assertEquals(10L, savedBooking.getId());
        assertEquals(1L, savedBooking.getSellerId()); // Assert seller is captured correctly
        
        // Assert product status updated to pending
        assertEquals("Pending", product.getStatus());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testUserCannotBookOwnListing() {
        Booking booking = new Booking();
        booking.setProductId(1L);
        booking.setConsumerId(1L); // Same user

        Product product = new Product();
        product.setId(1L);
        product.setUserId(1L); // SME

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ResponseEntity<?> response = bookingController.createBooking(booking);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("You cannot book your own listing.", response.getBody());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void testCannotBookUnavailableItem() {
        Booking booking = new Booking();
        booking.setProductId(1L);
        booking.setConsumerId(2L);

        Product product = new Product();
        product.setId(1L);
        product.setUserId(1L);
        product.setStatus("Booked"); // Unavailable

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ResponseEntity<?> response = bookingController.createBooking(booking);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("This product is currently Booked and cannot be booked.", response.getBody());
    }

    @Test
    void testSmeCanApproveBooking() {
        Booking booking = new Booking();
        booking.setId(100L);
        booking.setProductId(1L);
        booking.setStatus("PENDING");

        Product product = new Product();
        product.setId(1L);

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("status", "ACCEPTED");
        requestBody.put("confirmedLocation", "Downtown Cafe");

        ResponseEntity<?> response = bookingController.updateStatus(100L, requestBody);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("ACCEPTED", booking.getStatus());
        assertEquals("Downtown Cafe", booking.getConfirmedLocation());
        
        // Assert product status changes to "Booked" when accepted
        assertEquals("Booked", product.getStatus());
        verify(bookingRepository, times(1)).save(booking);
        verify(productRepository, times(1)).save(product);
    }
}
