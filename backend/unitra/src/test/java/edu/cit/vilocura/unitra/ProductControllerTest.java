package edu.cit.vilocura.unitra;

import edu.cit.vilocura.unitra.features.marketplace.Product;
import edu.cit.vilocura.unitra.features.marketplace.ProductController;
import edu.cit.vilocura.unitra.features.marketplace.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductControllerTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 3. MARKETPLACE (CORE BUSINESS LOGIC) TESTS

    @Test
    void testCreateListingSuccess() {
        Product product = new Product();
        product.setTitle("Office Desk");
        product.setDescription("A very nice office desk for sale.");
        product.setPrice(new BigDecimal("1500.00"));
        product.setListingType("For Sale");
        product.setCategory("Office & Business Supplies");
        product.setUserId(1L);
        product.setImageData("base64image");

        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(100L);
            return p;
        });

        ResponseEntity<?> response = productController.createProduct(product);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Product);
        Product savedProduct = (Product) response.getBody();
        assertEquals(100L, savedProduct.getId());
        assertEquals("Office Desk", savedProduct.getTitle());
    }

    @Test
    void testListingRetrieval() {
        Product product = new Product();
        product.setTitle("Test Item");
        product.setStatus("Available");

        when(productRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(product));

        List<Product> products = productController.getAllProducts();

        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        assertEquals("Test Item", products.get(0).getTitle());
    }

    @Test
    void testGetProductById() {
        Product product = new Product();
        product.setId(1L);
        product.setTitle("Unique Item");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.findById(2L)).thenReturn(Optional.empty());

        ResponseEntity<Product> validResponse = productController.getProductById(1L);
        assertEquals(200, validResponse.getStatusCodeValue());
        assertEquals("Unique Item", validResponse.getBody().getTitle());

        ResponseEntity<Product> notFoundResponse = productController.getProductById(2L);
        assertEquals(404, notFoundResponse.getStatusCodeValue());
    }
}
