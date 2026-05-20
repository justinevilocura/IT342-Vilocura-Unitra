package com.example.unitra.features.community

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.unitra.R

class PostAdapter(
    private var posts: List<Post>,
    private val onLikeClick: (Post) -> Unit
) : RecyclerView.Adapter<PostAdapter.PostViewHolder>() {

    class PostViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvAuthorName: TextView = view.findViewById(R.id.tvAuthorName)
        val tvAuthorRole: TextView = view.findViewById(R.id.tvAuthorRole)
        val tvContent: TextView = view.findViewById(R.id.tvContent)
        val btnLike: Button = view.findViewById(R.id.btnLike)
        val btnComment: Button = view.findViewById(R.id.btnComment)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_post, parent, false)
        return PostViewHolder(view)
    }

    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        val post = posts[position]
        holder.tvAuthorName.text = post.authorName
        
        val role = post.authorRole ?: "User"
        val time = post.createdAt ?: "Just now"
        holder.tvAuthorRole.text = "$role • $time"
        
        holder.tvContent.text = post.content
        holder.btnLike.text = "Like (${post.likesCount})"
        
        holder.btnLike.setOnClickListener {
            onLikeClick(post)
        }
    }

    override fun getItemCount() = posts.size

    fun updateData(newPosts: List<Post>) {
        this.posts = newPosts
        notifyDataSetChanged()
    }
}
