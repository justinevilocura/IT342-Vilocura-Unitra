package edu.cit.vilocura.unitra.features.bookings;

import edu.cit.vilocura.unitra.features.bookings.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<Booking> findByConsumerIdOrderByCreatedAtDesc(Long consumerId);
}

