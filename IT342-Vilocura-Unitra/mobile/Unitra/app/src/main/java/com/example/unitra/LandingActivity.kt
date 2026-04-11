package com.example.unitra

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class LandingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_landing)
        
        // Handle window insets for full screen experience
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val btnJoin = findViewById<Button>(R.id.btnJoin)
        val btnLearnMore = findViewById<Button>(R.id.btnLearnMore)

        btnJoin.setOnClickListener {
            // Navigate to Registration
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        btnLearnMore.setOnClickListener {
            // Navigate to Login
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }
}
