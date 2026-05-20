package com.example.unitra.features.dashboard

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.unitra.R
import com.example.unitra.features.bookings.BookingActivity
import com.example.unitra.features.community.CommunityActivity
import com.example.unitra.features.marketplace.MarketplaceActivity
import com.example.unitra.features.profile.ProfileActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.dashboardScrollView)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigation)
        bottomNav.selectedItemId = R.id.nav_dashboard
        
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> true
                R.id.nav_marketplace -> {
                    startActivity(Intent(this, MarketplaceActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                R.id.nav_community -> {
                    startActivity(Intent(this, CommunityActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                R.id.nav_bookings -> {
                    startActivity(Intent(this, BookingActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                R.id.nav_profile -> {
                    startActivity(Intent(this, ProfileActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                else -> false
            }
        }
        
        // Initial setup for the dashboard widgets
        findViewById<TextView>(R.id.tvTotalBookings).text = "0"
        findViewById<TextView>(R.id.tvActiveListings).text = "0"
        findViewById<TextView>(R.id.tvPendingRequests).text = "0"
        findViewById<TextView>(R.id.tvCompleted).text = "0"
    }
}
