package com.example.unitra.features.bookings

data class Booking(
    val id: Long? = null,
    val productId: Long? = null,
    val sellerId: Long? = null,
    val consumerId: Long? = null,
    val startDate: String? = null,
    val endDate: String? = null,
    val transactionType: String? = null,
    val meetupLocation: String? = null,
    val deliveryAddress: String? = null,
    val status: String? = "PENDING",
    val confirmedDate: String? = null,
    val confirmedTime: String? = null,
    val confirmedLocation: String? = null
)
