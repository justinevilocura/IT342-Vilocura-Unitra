package edu.cit.vilocura.unitra.repository;

import edu.cit.vilocura.unitra.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<Booking> findByConsumerIdOrderByCreatedAtDesc(Long consumerId);
}
