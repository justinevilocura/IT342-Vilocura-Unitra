package com.example.unitra.features.profile

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.unitra.R
import com.example.unitra.core.network.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileActivity : AppCompatActivity() {

    private lateinit var tvName: TextView
    private lateinit var tvTagline: TextView
    private lateinit var tvBio: TextView
    private lateinit var tvCompany: TextView
    private lateinit var tvIndustry: TextView
    private lateinit var tvLocation: TextView
    private lateinit var progressBar: ProgressBar
    
    private lateinit var api: ProfileApi

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        // Edge to edge
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(0, 0, 0, systemBars.bottom)
            insets
        }

        api = RetrofitClient.instance.create(ProfileApi::class.java)

        tvName = findViewById(R.id.tvName)
        tvTagline = findViewById(R.id.tvTagline)
        tvBio = findViewById(R.id.tvBio)
        tvCompany = findViewById(R.id.tvCompany)
        tvIndustry = findViewById(R.id.tvIndustry)
        tvLocation = findViewById(R.id.tvLocation)
        progressBar = findViewById(R.id.progressBar)

        findViewById<Button>(R.id.btnEditProfile).setOnClickListener {
            Toast.makeText(this, "Edit Profile coming soon!", Toast.LENGTH_SHORT).show()
        }

        // Hardcoding user ID 1 for now until Auth persistence is fully wired
        fetchProfile(1L)
    }

    private fun fetchProfile(userId: Long) {
        progressBar.visibility = View.VISIBLE
        api.getProfile(userId).enqueue(object : Callback<UserProfileDTO> {
            override fun onResponse(call: Call<UserProfileDTO>, response: Response<UserProfileDTO>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    response.body()?.let { updateUI(it) }
                } else {
                    Toast.makeText(this@ProfileActivity, "Failed to load profile", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserProfileDTO>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@ProfileActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateUI(profile: UserProfileDTO) {
        tvName.text = profile.name ?: "Unknown User"
        tvTagline.text = profile.tagline ?: "Student"
        
        if (!profile.bio.isNullOrBlank()) {
            tvBio.text = profile.bio
        }
        
        if (!profile.companyName.isNullOrBlank()) {
            tvCompany.text = profile.companyName
        }
        
        if (!profile.industry.isNullOrBlank()) {
            tvIndustry.text = profile.industry
        }
        
        val locationStr = listOfNotNull(profile.city, profile.province).joinToString(", ")
        if (locationStr.isNotBlank()) {
            tvLocation.text = locationStr
        }
    }
}
