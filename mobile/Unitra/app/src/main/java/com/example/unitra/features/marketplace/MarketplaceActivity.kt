package com.example.unitra.features.marketplace

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.unitra.R
import com.example.unitra.core.network.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MarketplaceActivity : AppCompatActivity() {

    private lateinit var rvProducts: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var productAdapter: ProductAdapter
    private lateinit var api: MarketplaceApi

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_marketplace)

        // Full Screen Insets
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        api = RetrofitClient.instance.create(MarketplaceApi::class.java)

        rvProducts = findViewById(R.id.rvProducts)
        progressBar = findViewById(R.id.progressBar)
        val btnCreateListing = findViewById<Button>(R.id.btnCreateListing)

        // Set up grid (2 columns like web)
        rvProducts.layoutManager = GridLayoutManager(this, 2)
        productAdapter = ProductAdapter(emptyList()) { product ->
            Toast.makeText(this, "Clicked ${product.title}", Toast.LENGTH_SHORT).show()
            // In the future, navigate to ProductDetailsActivity here
        }
        rvProducts.adapter = productAdapter

        btnCreateListing.setOnClickListener {
            Toast.makeText(this, "Create Listing Modal coming soon!", Toast.LENGTH_SHORT).show()
        }

        fetchProducts()
    }

    private fun fetchProducts() {
        progressBar.visibility = View.VISIBLE
        api.getAllProducts().enqueue(object : Callback<List<Product>> {
            override fun onResponse(call: Call<List<Product>>, response: Response<List<Product>>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    val products = response.body() ?: emptyList()
                    productAdapter.updateData(products)
                } else {
                    Toast.makeText(this@MarketplaceActivity, "Failed to load marketplace", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Product>>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@MarketplaceActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
