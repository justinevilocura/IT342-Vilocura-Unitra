package com.example.unitra.features.bookings

import retrofit2.Call
import retrofit2.http.*

interface BookingApi {
    @GET("api/bookings")
    fun getAllBookings(): Call<List<Booking>>

    @POST("api/bookings")
    fun createBooking(@Body booking: Booking): Call<Booking>

    @POST("api/bookings/{id}/status")
    fun updateBookingStatus(@Path("id") id: Long, @Query("status") status: String): Call<Booking>
}
