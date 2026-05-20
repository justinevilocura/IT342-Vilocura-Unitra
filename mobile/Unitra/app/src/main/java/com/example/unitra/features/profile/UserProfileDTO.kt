package com.example.unitra.features.profile

data class UserProfileDTO(
    val name: String? = null,
    val tagline: String? = null,
    val bio: String? = null,
    val avatarData: String? = null,
    val companyName: String? = null,
    val industry: String? = null,
    val businessDescription: String? = null,
    val streetAddress: String? = null,
    val city: String? = null,
    val province: String? = null,
    val contactPhone: String? = null
)
