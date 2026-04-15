package com.hotel.booking.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hotel.booking.entity.User;
import com.hotel.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@RestController
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/test-db")
    public String testDb() {
        Optional<User> u = userRepository.findByEmail("admin@hotel.com");
        if (u.isPresent()) {
            User user = u.get();
            return "Found User! Password Hash: " + user.getPassword() + " Role: " + user.getRole().getName();
        } else {
            return "USER NOT FOUND in Database!";
        }
    }
}
