package edu.cit.vilocura.unitra.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Unitra Backend API is running successfully!";
    }
}
