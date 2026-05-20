package com.example.unitra.features.marketplace

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.unitra.R
import java.text.NumberFormat
import java.util.Locale

class ProductAdapter(
    private var products: List<Product>,
    private val onProductClick: (Product) -> Unit
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    class ProductViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val ivProductImage: ImageView = view.findViewById(R.id.ivProductImage)
        val tvCategory: TextView = view.findViewById(R.id.tvCategory)
        val tvTitle: TextView = view.findViewById(R.id.tvTitle)
        val tvPrice: TextView = view.findViewById(R.id.tvPrice)
        val tvType: TextView = view.findViewById(R.id.tvType)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_product, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = products[position]
        
        holder.tvTitle.text = product.title
        holder.tvCategory.text = product.category ?: "OTHER"
        holder.tvType.text = product.listingType ?: "Unknown"

        // Format price if it's "For Sale"
        if (product.listingType == "For Sale" && product.price != null) {
            val format = NumberFormat.getCurrencyInstance(Locale("en", "PH"))
            holder.tvPrice.text = format.format(product.price)
        } else {
            holder.tvPrice.text = "Free / Exchange"
        }

        // Ideally, handle base64 image decoding here for ivProductImage
        // Since we are not importing a massive Base64 decoder library, we just leave the wireframe for now
        
        holder.itemView.setOnClickListener {
            onProductClick(product)
        }
    }

    override fun getItemCount() = products.size

    fun updateData(newProducts: List<Product>) {
        this.products = newProducts
        notifyDataSetChanged()
    }
}
