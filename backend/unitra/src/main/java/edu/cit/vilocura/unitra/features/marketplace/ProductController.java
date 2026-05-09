package edu.cit.vilocura.unitra.features.marketplace;

import edu.cit.vilocura.unitra.features.marketplace.Product;
import edu.cit.vilocura.unitra.features.marketplace.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getTitle() == null || product.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required");
        }
        if (product.getDescription() == null || product.getDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Description is required");
        }
        if ("For Sale".equalsIgnoreCase(product.getListingType()) && 
            (product.getPrice() == null || product.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0)) {
            return ResponseEntity.badRequest().body("For Sale items must have a valid price strictly greater than 0.");
        }
        if (product.getImageData() == null || product.getImageData().isEmpty()) {
            return ResponseEntity.badRequest().body("Image is required");
        }
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

