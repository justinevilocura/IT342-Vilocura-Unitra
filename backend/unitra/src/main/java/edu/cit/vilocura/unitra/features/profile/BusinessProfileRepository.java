package edu.cit.vilocura.unitra.features.profile;

import edu.cit.vilocura.unitra.features.profile.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long> {
    Optional<BusinessProfile> findByUserId(Long userId);
}

