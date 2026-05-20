package com.example.unitra.features.profile

import retrofit2.Call
import retrofit2.http.*

interface ProfileApi {
    @GET("api/profile/{userId}")
    fun getProfile(@Path("userId") userId: Long): Call<UserProfileDTO>

    @PUT("api/profile/{userId}")
    fun updateProfile(@Path("userId") userId: Long, @Body profile: UserProfileDTO): Call<UserProfileDTO>
}
