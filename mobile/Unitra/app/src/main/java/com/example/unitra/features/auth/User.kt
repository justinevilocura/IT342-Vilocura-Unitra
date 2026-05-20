package com.example.unitra.features.auth

import com.google.gson.annotations.SerializedName

data class User(
    val name: String? = null,
    val email: String,
    val password: String,
    val role: Role? = null
) {
    enum class Role {
        SME, CONSUMER, ADMIN
    }
}
