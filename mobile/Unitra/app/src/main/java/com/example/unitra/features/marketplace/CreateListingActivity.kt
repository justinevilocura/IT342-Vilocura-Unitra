package com.example.unitra.features.marketplace

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.unitra.R
import com.example.unitra.core.network.RetrofitClient
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CreateListingActivity : AppCompatActivity() {

    private lateinit var etTitle: TextInputEditText
    private lateinit var etDescription: TextInputEditText
    private lateinit var etPrice: TextInputEditText
    private lateinit var priceInputLayout: TextInputLayout
    private lateinit var typeToggleGroup: MaterialButtonToggleGroup
    private lateinit var btnSubmit: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var api: MarketplaceApi

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_listing)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        api = RetrofitClient.instance.create(MarketplaceApi::class.java)

        etTitle = findViewById(R.id.etTitle)
        etDescription = findViewById(R.id.etDescription)
        etPrice = findViewById(R.id.etPrice)
        priceInputLayout = findViewById(R.id.priceInputLayout)
        typeToggleGroup = findViewById(R.id.typeToggleGroup)
        btnSubmit = findViewById(R.id.btnSubmit)
        progressBar = findViewById(R.id.progressBar)
        
        findViewById<ImageButton>(R.id.btnBack).setOnClickListener { finish() }

        // Logic to show/hide price based on type
        typeToggleGroup.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                if (checkedId == R.id.btnForSale) {
                    priceInputLayout.visibility = View.VISIBLE
                } else {
                    priceInputLayout.visibility = View.GONE
                    etPrice.text?.clear()
                }
            }
        }

        btnSubmit.setOnClickListener { submitListing() }
    }

    private fun submitListing() {
        val title = etTitle.text.toString().trim()
        val description = etDescription.text.toString().trim()
        val isForSale = typeToggleGroup.checkedButtonId == R.id.btnForSale
        val listingType = if (isForSale) "For Sale" else "Free / Exchange"
        val priceStr = etPrice.text.toString().trim()
        
        if (title.isEmpty() || description.isEmpty()) {
            Toast.makeText(this, "Title and description required", Toast.LENGTH_SHORT).show()
            return
        }
        
        var price: Double? = null
        if (isForSale) {
            price = priceStr.toDoubleOrNull()
            if (price == null || price <= 0) {
                Toast.makeText(this, "Valid price strictly greater than 0 is required", Toast.LENGTH_SHORT).show()
                return
            }
        }

        btnSubmit.isEnabled = false
        progressBar.visibility = View.VISIBLE

        val product = Product(
            title = title,
            description = description,
            listingType = listingType,
            price = price,
            imageData = "base64_placeholder", // Placeholder since we don't have an image picker yet
            userId = 1L, // mock
            authorName = "Felix Test"
        )

        api.createProduct(product).enqueue(object : Callback<Product> {
            override fun onResponse(call: Call<Product>, response: Response<Product>) {
                btnSubmit.isEnabled = true
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    Toast.makeText(this@CreateListingActivity, "Listing created!", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@CreateListingActivity, "Failed: ${response.errorBody()?.string()}", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<Product>, t: Throwable) {
                btnSubmit.isEnabled = true
                progressBar.visibility = View.GONE
                Toast.makeText(this@CreateListingActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
