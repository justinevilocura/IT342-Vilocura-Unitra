package com.example.unitra.features.bookings

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.unitra.R

class BookingAdapter(
    private var bookings: List<Booking>,
    private val onBookingClick: (Booking) -> Unit
) : RecyclerView.Adapter<BookingAdapter.BookingViewHolder>() {

    class BookingViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTransactionType: TextView = view.findViewById(R.id.tvTransactionType)
        val tvStatus: TextView = view.findViewById(R.id.tvStatus)
        val tvDates: TextView = view.findViewById(R.id.tvDates)
        val tvLocation: TextView = view.findViewById(R.id.tvLocation)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookingViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_booking, parent, false)
        return BookingViewHolder(view)
    }

    override fun onBindViewHolder(holder: BookingViewHolder, position: Int) {
        val booking = bookings[position]
        
        holder.tvTransactionType.text = booking.transactionType ?: "UNKNOWN"
        holder.tvStatus.text = booking.status ?: "PENDING"
        
        val dateString = if (booking.startDate != null && booking.endDate != null) {
            "${booking.startDate} to ${booking.endDate}"
        } else {
            booking.startDate ?: "N/A"
        }
        holder.tvDates.text = "Date: $dateString"

        val location = booking.meetupLocation ?: booking.deliveryAddress ?: "Not specified"
        holder.tvLocation.text = "Location: $location"

        holder.itemView.setOnClickListener {
            onBookingClick(booking)
        }
    }

    override fun getItemCount() = bookings.size

    fun updateData(newBookings: List<Booking>) {
        this.bookings = newBookings
        notifyDataSetChanged()
    }
}
