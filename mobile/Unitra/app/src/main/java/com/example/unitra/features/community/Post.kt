package com.example.unitra.features.community

import java.time.LocalDateTime

data class Post(
    val id: Long? = null,
    val authorId: Long,
    val authorName: String,
    val authorRole: String? = null,
    val content: String,
    val createdAt: String? = null,
    val likesCount: Int = 0,
    val isLikedByCurrentUser: Boolean = false,
    val comments: List<Comment>? = null
)

data class Comment(
    val id: Long? = null,
    val postId: Long,
    val authorId: Long,
    val authorName: String,
    val content: String,
    val createdAt: String? = null
)
