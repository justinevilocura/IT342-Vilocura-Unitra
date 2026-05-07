package edu.cit.vilocura.unitra.controller;

import edu.cit.vilocura.unitra.entity.Booking;
import edu.cit.vilocura.unitra.entity.Product;
import edu.cit.vilocura.unitra.entity.User;
import edu.cit.vilocura.unitra.repository.BookingRepository;
import edu.cit.vilocura.unitra.repository.ProductRepository;
import edu.cit.vilocura.unitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Fetch product to get the seller ID
        Product product = productRepository.findById(booking.getProductId()).orElse(null);
        if (product == null) return ResponseEntity.badRequest().body("Product not found");
        
        // Prevent self-booking
        if (product.getUserId().equals(booking.getConsumerId())) {
            return ResponseEntity.badRequest().body("You cannot book your own listing.");
        }
        
        booking.setSellerId(product.getUserId());
        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/received/{sellerId}")
    public List<Map<String, Object>> getReceivedBookings(@PathVariable Long sellerId) {
        return bookingRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).stream().map(booking -> {
            Product product = productRepository.findById(booking.getProductId()).orElse(null);
            User consumer = userRepository.findById(booking.getConsumerId()).orElse(null);
            
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", booking.getId());
            map.put("productId", booking.getProductId());
            map.put("productTitle", product != null ? product.getTitle() : "Unknown Product");
            map.put("productImage", product != null ? product.getImageData() : null);
            map.put("category", product != null ? product.getCategory() : "");
            map.put("listingType", product != null ? product.getListingType() : "");
            map.put("consumerName", (consumer != null && consumer.getProfile() != null) ? consumer.getProfile().getDisplayName() : "User #" + booking.getConsumerId());
            map.put("consumerCompany", (consumer != null && consumer.getBusinessProfile() != null) ? consumer.getBusinessProfile().getCompanyName() : "");
            map.put("startDate", booking.getStartDate());
            map.put("endDate", booking.getEndDate());
            map.put("status", booking.getStatus());
            map.put("message", booking.getMessage());
            map.put("consumerId", booking.getConsumerId());
            map.put("sellerId", booking.getSellerId());
            map.put("transactionType", booking.getTransactionType());
            map.put("meetupLocation", booking.getMeetupLocation());
            map.put("deliveryAddress", booking.getDeliveryAddress());
            map.put("createdAt", booking.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy h:mm a")));
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/sent/{consumerId}")
    public List<Map<String, Object>> getSentBookings(@PathVariable Long consumerId) {
        return bookingRepository.findByConsumerIdOrderByCreatedAtDesc(consumerId).stream().map(booking -> {
            Product product = productRepository.findById(booking.getProductId()).orElse(null);
            User seller = userRepository.findById(booking.getSellerId()).orElse(null);
            
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", booking.getId());
            map.put("productId", booking.getProductId());
            map.put("productTitle", product != null ? product.getTitle() : "Unknown Product");
            map.put("productImage", product != null ? product.getImageData() : null);
            map.put("category", product != null ? product.getCategory() : "");
            map.put("listingType", product != null ? product.getListingType() : "");
            map.put("sellerName", (seller != null && seller.getProfile() != null) ? seller.getProfile().getDisplayName() : "User #" + booking.getSellerId());
            map.put("sellerCompany", (seller != null && seller.getBusinessProfile() != null) ? seller.getBusinessProfile().getCompanyName() : "");
            map.put("startDate", booking.getStartDate());
            map.put("endDate", booking.getEndDate());
            map.put("status", booking.getStatus());
            map.put("message", booking.getMessage());
            map.put("consumerId", booking.getConsumerId());
            map.put("sellerId", booking.getSellerId());
            map.put("transactionType", booking.getTransactionType());
            map.put("meetupLocation", booking.getMeetupLocation());
            map.put("deliveryAddress", booking.getDeliveryAddress());
            map.put("createdAt", booking.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy h:mm a")));
            return map;
        }).collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(body.get("status"));
            bookingRepository.save(booking);
            return ResponseEntity.ok("Status updated");
        }).orElse(ResponseEntity.notFound().build());
    }
}
