package edu.cit.vilocura.unitra.features.profile;

import edu.cit.vilocura.unitra.features.auth.User;

import jakarta.persistence.*;

@Entity
@Table(name = "business_profiles")
public class BusinessProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "company_name")
    private String companyName;

    private String industry;

    @Column(name = "business_description", columnDefinition = "text")
    private String businessDescription;

    @Column(name = "street_address")
    private String streetAddress;

    private String city;

    private String province;

    @Column(name = "contact_phone")
    private String contactPhone;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getBusinessDescription() { return businessDescription; }
    public void setBusinessDescription(String businessDescription) { this.businessDescription = businessDescription; }

    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}


