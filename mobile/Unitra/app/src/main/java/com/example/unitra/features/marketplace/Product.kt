package com.example.unitra.features.marketplace

import java.math.BigDecimal

data class Product(
    val id: Long? = null,
    val userId: Long? = null,
    val listingType: String? = null,
    val category: String? = null,
    val title: String,
    val description: String,
    val price: Double? = null,
    val location: String? = null,
    val companyName: String? = null,
    val imageData: String? = null,
    val sellerName: String? = null,
    val name: String? = null,
    val status: String? = "Available",
    val authorName: String? = null
)
