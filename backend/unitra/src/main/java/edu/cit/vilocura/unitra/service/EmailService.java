package edu.cit.vilocura.unitra.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationToken) {
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + verificationToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your Unitra Account");
        message.setText("Welcome to Unitra!\n\n" +
                "Please click the link below to verify your account:\n" +
                verificationUrl + "\n\n" +
                "If you did not create an account, please ignore this email.");

        mailSender.send(message);
    }
}
