package edu.cit.vilocura.unitra.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "consumer_id")
    private Long consumerId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;



    @Column(name = "transaction_type")
    private String transactionType; // MEETUP or DELIVERY

    @Column(name = "meetup_location")
    private String meetupLocation;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED

    @Column(name = "confirmed_date")
    private LocalDate confirmedDate;

    @Column(name = "confirmed_time")
    private String confirmedTime;

    @Column(name = "confirmed_location")
    private String confirmedLocation;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public Long getConsumerId() { return consumerId; }
    public void setConsumerId(Long consumerId) { this.consumerId = consumerId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getMeetupLocation() { return meetupLocation; }
    public void setMeetupLocation(String meetupLocation) { this.meetupLocation = meetupLocation; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getConfirmedDate() { return confirmedDate; }
    public void setConfirmedDate(LocalDate confirmedDate) { this.confirmedDate = confirmedDate; }
    public String getConfirmedTime() { return confirmedTime; }
    public void setConfirmedTime(String confirmedTime) { this.confirmedTime = confirmedTime; }
    public String getConfirmedLocation() { return confirmedLocation; }
    public void setConfirmedLocation(String confirmedLocation) { this.confirmedLocation = confirmedLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
