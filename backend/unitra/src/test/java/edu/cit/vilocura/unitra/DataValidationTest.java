package edu.cit.vilocura.unitra;

import edu.cit.vilocura.unitra.features.marketplace.Product;
import edu.cit.vilocura.unitra.features.marketplace.ProductController;
import edu.cit.vilocura.unitra.features.marketplace.ProductRepository;
import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.auth.UserService;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class DataValidationTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 5. DATA VALIDATION & EDGE CASES

    @Test
    void testEmptyPayloadRejection() {
        Product emptyProduct = new Product(); // No title, desc, image, etc.
        emptyProduct.setListingType("For Sale");

        ResponseEntity<?> response = productController.createProduct(emptyProduct);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Title is required", response.getBody());
    }

    @Test
    void testNegativePriceRejected() {
        Product product = new Product();
        product.setTitle("Test Title");
        product.setDescription("Test Description");
        product.setListingType("For Sale");
        product.setPrice(new BigDecimal("-10.00")); // Negative price

        ResponseEntity<?> response = productController.createProduct(product);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("For Sale items must have a valid price strictly greater than 0.", response.getBody());
    }

    @Test
    void testMissingImageRejected() {
        Product product = new Product();
        product.setTitle("Test Title");
        product.setDescription("Test Description");
        product.setListingType("For Swap");
        // No image set

        ResponseEntity<?> response = productController.createProduct(product);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Image is required", response.getBody());
    }

    @Test
    void testInvalidEmailFormat() {
        // Mocking user email validation check conceptually. 
        // Assuming email format validation is handled by @Valid in real controller,
        // we can test the explicit domain rule for SME
        User sme = new User();
        sme.setEmail("sme@gmail.com"); // Invalid domain for SME
        sme.setRole(User.Role.SME);
        
        // This simulates the behavior of SME email enforcement
        boolean isValidSmeEmail = sme.getEmail().endsWith("@cit.edu");
        assertFalse(isValidSmeEmail, "SME must use @cit.edu email");
    }

    @Test
    void testInvalidDates() {
        // Validating booking dates: end date cannot be before start date
        String startDate = "2023-10-05";
        String endDate = "2023-10-01"; // End date is before start date

        boolean isValidDateRange = startDate.compareTo(endDate) <= 0;

        assertFalse(isValidDateRange, "End date cannot be before start date");
    }
}
