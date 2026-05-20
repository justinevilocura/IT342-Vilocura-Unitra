package com.example.unitra.features.community

import retrofit2.Call
import retrofit2.http.*

interface CommunityApi {
    @GET("api/community/posts")
    fun getAllPosts(): Call<List<Post>>

    @POST("api/community/posts")
    fun createPost(@Body post: Post): Call<Post>

    @POST("api/community/posts/{postId}/like")
    fun toggleLike(@Path("postId") postId: Long, @Query("userId") userId: Long): Call<Void>

    @POST("api/community/comments")
    fun addComment(@Body comment: Comment): Call<Comment>
}
