package com.example.unitra.features.marketplace

import retrofit2.Call
import retrofit2.http.*

interface MarketplaceApi {
    @GET("api/products")
    fun getAllProducts(): Call<List<Product>>

    @POST("api/products")
    fun createProduct(@Body product: Product): Call<Product>
}
