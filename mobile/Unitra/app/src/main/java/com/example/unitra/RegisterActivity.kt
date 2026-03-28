package com.example.unitra

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.unitra.api.RetrofitClient
import com.example.unitra.model.User
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    private lateinit var etName: TextInputEditText
    private lateinit var etEmail: TextInputEditText
    private lateinit var etPassword: TextInputEditText
    private lateinit var roleToggleGroup: MaterialButtonToggleGroup
    private lateinit var btnRegister: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var uploadSection: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)

        etName = findViewById(R.id.etName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        roleToggleGroup = findViewById(R.id.roleToggleGroup)
        btnRegister = findViewById(R.id.btnRegister)
        progressBar = findViewById(R.id.progressBar)
        uploadSection = findViewById(R.id.uploadSection)
        val btnBack = findViewById<ImageButton>(R.id.btnBack)
        val tvLogin = findViewById<TextView>(R.id.tvLogin)

        btnBack.setOnClickListener { finish() }

        tvLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        roleToggleGroup.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                if (checkedId == R.id.btnSme) {
                    uploadSection.visibility = View.VISIBLE
                } else {
                    uploadSection.visibility = View.GONE
                }
            }
        }

        btnRegister.setOnClickListener {
            handleRegister()
        }
    }

    private fun handleRegister() {
        val name = etName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()
        
        val role = if (roleToggleGroup.checkedButtonId == R.id.btnSme) {
            User.Role.SME
        } else {
            User.Role.CONSUMER
        }

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            return
        }

        progressBar.visibility = View.VISIBLE
        btnRegister.isEnabled = false

        val user = User(name, email, password, role)

        RetrofitClient.instance.register(user).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                progressBar.visibility = View.GONE
                btnRegister.isEnabled = true

                val message = response.body()?.string() ?: response.errorBody()?.string() ?: "Unknown error"

                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterActivity, message, Toast.LENGTH_LONG).show()
                    // Navigate to Login
                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this@RegisterActivity, "Registration failed: $message", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                progressBar.visibility = View.GONE
                btnRegister.isEnabled = true
                Toast.makeText(this@RegisterActivity, "Connection error: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }
}
