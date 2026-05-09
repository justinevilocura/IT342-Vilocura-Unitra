package edu.cit.vilocura.unitra.features.auth;

import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import edu.cit.vilocura.unitra.features.profile.Profile;
import edu.cit.vilocura.unitra.features.profile.BusinessProfile;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional; // Corrected import for Jakarta

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Check if email is already taken
    public boolean isEmailTaken(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }

    // Register user
    @Transactional
    public User registerUser(User user) {
        System.out.println("Registering user: " + user.getEmail() + " with role: " + user.getRole());
        if (isEmailTaken(user.getEmail())) {
            throw new IllegalArgumentException("Email is already taken");
        }
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword())); // Encrypt password using BCrypt
        
        // Setup verification
        user.setEmailVerified(false);
        String token = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(token);
        
        // Send actual verification email
        emailService.sendVerificationEmail(user.getEmail(), token);
        
        if (user.getRole() == User.Role.SME) {
            System.out.println("Assigning Role ID 1 (SME)");
            user.setRoleId(1L);
        } else if (user.getRole() == User.Role.CONSUMER) {
            System.out.println("Assigning Role ID 2 (CONSUMER)");
            user.setRoleId(2L);
        } else {
            System.out.println("Assigning Role ID 3 (ADMIN/UNKNOWN)");
            user.setRoleId(3L);
        }
        return userRepository.save(user);
    }

    // Verify Email
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));
        
        user.setEmailVerified(true);
        user.setVerificationToken(null); // Clear token after verification
        userRepository.save(user);
    }

    // Login user
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!new BCryptPasswordEncoder().matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            throw new IllegalArgumentException("Verify your Email");
        }

        return user; // Successful login
    }

    public java.util.List<User> getPendingSmes() {
        return userRepository.findByRoleIdAndStatus(1L, "PENDING");
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setStatus(status);
        return userRepository.save(user);
    }

    @Autowired
    private edu.cit.vilocura.unitra.features.profile.ProfileRepository profileRepository;

    @Autowired
    private edu.cit.vilocura.unitra.features.profile.BusinessProfileRepository businessProfileRepository;

    // Profile Management
    public edu.cit.vilocura.unitra.features.profile.UserProfileDTO getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        edu.cit.vilocura.unitra.features.profile.UserProfileDTO dto = new edu.cit.vilocura.unitra.features.profile.UserProfileDTO();
        dto.setName(user.getName());
        
        if (user.getProfile() != null) {
            if (user.getProfile().getDisplayName() != null) {
                dto.setName(user.getProfile().getDisplayName());
            }
            dto.setTagline(user.getProfile().getTagline());
            dto.setBio(user.getProfile().getPersonalBio());
            dto.setAvatarData(user.getProfile().getAvatarUrl());
        }
        
        if (user.getBusinessProfile() != null) {
            dto.setCompanyName(user.getBusinessProfile().getCompanyName());
            dto.setIndustry(user.getBusinessProfile().getIndustry());
            dto.setBusinessDescription(user.getBusinessProfile().getBusinessDescription());
            dto.setStreetAddress(user.getBusinessProfile().getStreetAddress());
            dto.setCity(user.getBusinessProfile().getCity());
            dto.setProvince(user.getBusinessProfile().getProvince());
            dto.setContactPhone(user.getBusinessProfile().getContactPhone());
        }
        return dto;
    }

    @Transactional
    public edu.cit.vilocura.unitra.features.profile.UserProfileDTO updateUserProfile(Long id, edu.cit.vilocura.unitra.features.profile.UserProfileDTO updatedData) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (updatedData.getName() != null) {
            existingUser.setName(updatedData.getName());
            userRepository.save(existingUser);
        }

        // Update Personal Profile
        edu.cit.vilocura.unitra.features.profile.Profile profile = existingUser.getProfile();
        if (profile == null) {
            profile = new edu.cit.vilocura.unitra.features.profile.Profile();
            profile.setUser(existingUser);
        }
        if (updatedData.getName() != null) profile.setDisplayName(updatedData.getName());
        if (updatedData.getTagline() != null) profile.setTagline(updatedData.getTagline());
        if (updatedData.getBio() != null) profile.setPersonalBio(updatedData.getBio());
        if (updatedData.getAvatarData() != null) profile.setAvatarUrl(updatedData.getAvatarData());
        profileRepository.save(profile);
        
        // Update Business Profile (ONLY for SME Users, assuming roleId == 1 is SME)
        if (existingUser.getRoleId() != null && existingUser.getRoleId() == 1L) {
            edu.cit.vilocura.unitra.features.profile.BusinessProfile businessProfile = existingUser.getBusinessProfile();
            if (businessProfile == null) {
                businessProfile = new edu.cit.vilocura.unitra.features.profile.BusinessProfile();
                businessProfile.setUser(existingUser);
            }
            if (updatedData.getCompanyName() != null) businessProfile.setCompanyName(updatedData.getCompanyName());
            if (updatedData.getIndustry() != null) businessProfile.setIndustry(updatedData.getIndustry());
            if (updatedData.getBusinessDescription() != null) businessProfile.setBusinessDescription(updatedData.getBusinessDescription());
            if (updatedData.getStreetAddress() != null) businessProfile.setStreetAddress(updatedData.getStreetAddress());
            if (updatedData.getCity() != null) businessProfile.setCity(updatedData.getCity());
            if (updatedData.getProvince() != null) businessProfile.setProvince(updatedData.getProvince());
            if (updatedData.getContactPhone() != null) businessProfile.setContactPhone(updatedData.getContactPhone());
            businessProfileRepository.save(businessProfile);
        }

        return getUserProfile(id); // Return the newly mapped data
    }
}

