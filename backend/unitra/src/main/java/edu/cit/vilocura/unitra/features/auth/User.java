package edu.cit.vilocura.unitra.features.auth;

import edu.cit.vilocura.unitra.features.profile.Profile;
import edu.cit.vilocura.unitra.features.profile.BusinessProfile;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(name = "full_name")
    private String name;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash")
    private String password;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

    @Column(name = "email_verified", nullable = false, columnDefinition = "boolean default false")
    private boolean emailVerified = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Transient
    private Role role;

    @Column(name = "role_id")
    private Long roleId;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Profile profile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private BusinessProfile businessProfile;

    public enum Role {
        SME, CONSUMER, ADMIN
    }

    // Getters and Setters

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    public BusinessProfile getBusinessProfile() { return businessProfile; }
    public void setBusinessProfile(BusinessProfile businessProfile) { this.businessProfile = businessProfile; }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    // Getters and Setters

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    // Other getters and setters
    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setRole(String roleStr) {
        if (roleStr == null) return;
        try {
            this.role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Log or handle invalid role
        }
    }
}

