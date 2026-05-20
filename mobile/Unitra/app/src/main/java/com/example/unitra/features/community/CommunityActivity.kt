package com.example.unitra.features.community

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.unitra.R
import com.example.unitra.core.network.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CommunityActivity : AppCompatActivity() {

    private lateinit var rvPosts: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var postAdapter: PostAdapter
    private lateinit var api: CommunityApi
    
    private lateinit var etPostContent: EditText
    private lateinit var tvCharCount: TextView
    private lateinit var btnCreatePost: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_community)

        // Edge to Edge
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        api = RetrofitClient.instance.create(CommunityApi::class.java)

        rvPosts = findViewById(R.id.rvPosts)
        progressBar = findViewById(R.id.progressBar)
        etPostContent = findViewById(R.id.etPostContent)
        tvCharCount = findViewById(R.id.tvCharCount)
        btnCreatePost = findViewById(R.id.btnCreatePost)

        rvPosts.layoutManager = LinearLayoutManager(this)
        postAdapter = PostAdapter(emptyList()) { post ->
            // Handle Like Click
            post.id?.let { toggleLike(it) }
        }
        rvPosts.adapter = postAdapter

        setupPostCreation()
        fetchPosts()
    }

    private fun setupPostCreation() {
        btnCreatePost.isEnabled = false
        btnCreatePost.alpha = 0.5f

        etPostContent.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val length = s?.trim()?.length ?: 0
                tvCharCount.text = "$length / 500"
                
                if (length > 500) {
                    tvCharCount.setTextColor(resources.getColor(R.color.status_error, theme))
                    btnCreatePost.isEnabled = false
                    btnCreatePost.alpha = 0.5f
                } else if (length == 0) {
                    tvCharCount.setTextColor(resources.getColor(R.color.text_secondary, theme))
                    btnCreatePost.isEnabled = false
                    btnCreatePost.alpha = 0.5f
                } else {
                    tvCharCount.setTextColor(resources.getColor(R.color.text_secondary, theme))
                    btnCreatePost.isEnabled = true
                    btnCreatePost.alpha = 1.0f
                }
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        btnCreatePost.setOnClickListener {
            createPost()
        }
    }

    private fun fetchPosts() {
        progressBar.visibility = View.VISIBLE
        api.getAllPosts().enqueue(object : Callback<List<Post>> {
            override fun onResponse(call: Call<List<Post>>, response: Response<List<Post>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    val posts = response.body() ?: emptyList()
                    postAdapter.updateData(posts)
                } else {
                    Toast.makeText(this@CommunityActivity, "Failed to load posts", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Post>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@CommunityActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun createPost() {
        val content = etPostContent.text.toString().trim()
        if (content.isEmpty() || content.length > 500) return

        btnCreatePost.isEnabled = false
        btnCreatePost.text = "Posting..."
        
        // Use a mock user ID for now, normally fetched from SharedPreferences
        val newPost = Post(
            authorId = 1,
            authorName = "Felix Test", 
            authorRole = "Student Entrepreneur",
            content = content
        )

        api.createPost(newPost).enqueue(object : Callback<Post> {
            override fun onResponse(call: Call<Post>, response: Response<Post>) {
                btnCreatePost.text = "Post"
                if (response.isSuccessful) {
                    etPostContent.text.clear()
                    fetchPosts() // Refresh feed
                    Toast.makeText(this@CommunityActivity, "Post created!", Toast.LENGTH_SHORT).show()
                } else {
                    btnCreatePost.isEnabled = true
                    Toast.makeText(this@CommunityActivity, "Failed to create post", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Post>, t: Throwable) {
                btnCreatePost.isEnabled = true
                btnCreatePost.text = "Post"
                Toast.makeText(this@CommunityActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun toggleLike(postId: Long) {
        val currentUserId = 1L // Mock user ID
        api.toggleLike(postId, currentUserId).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    fetchPosts() // Soft refresh
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {}
        })
    }
}
