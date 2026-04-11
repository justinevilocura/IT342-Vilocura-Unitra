package edu.cit.vilocura.unitra.controller;

import edu.cit.vilocura.unitra.entity.Product;
import edu.cit.vilocura.unitra.repository.ProductRepository;
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
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }
}
