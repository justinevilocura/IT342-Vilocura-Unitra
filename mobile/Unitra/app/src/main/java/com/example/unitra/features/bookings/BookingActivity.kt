package com.example.unitra.features.bookings

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
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

class BookingActivity : AppCompatActivity() {

    private lateinit var rvBookings: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var bookingAdapter: BookingAdapter
    private lateinit var api: BookingApi

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_booking)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        api = RetrofitClient.instance.create(BookingApi::class.java)

        rvBookings = findViewById(R.id.rvBookings)
        progressBar = findViewById(R.id.progressBar)

        rvBookings.layoutManager = LinearLayoutManager(this)
        bookingAdapter = BookingAdapter(emptyList()) { booking ->
            Toast.makeText(this, "Booking ID: ${booking.id} clicked", Toast.LENGTH_SHORT).show()
        }
        rvBookings.adapter = bookingAdapter

        fetchBookings()
    }

    private fun fetchBookings() {
        progressBar.visibility = View.VISIBLE
        api.getAllBookings().enqueue(object : Callback<List<Booking>> {
            override fun onResponse(call: Call<List<Booking>>, response: Response<List<Booking>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    val bookings = response.body() ?: emptyList()
                    bookingAdapter.updateData(bookings)
                } else {
                    Toast.makeText(this@BookingActivity, "Failed to load bookings", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Booking>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@BookingActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
