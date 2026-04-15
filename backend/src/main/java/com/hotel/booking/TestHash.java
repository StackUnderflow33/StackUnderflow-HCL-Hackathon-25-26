package com.hotel.booking;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "admin123";
        String hash = "$2a$10$fV2hJ7b/.R27Hn6S.vYf1.tK8b5u5p1w3g9rFdL2rF8/g3wV5fUqC";
        boolean match = encoder.matches(raw, hash);
        System.out.println("Match: " + match);
        System.out.println("New Hash: " + encoder.encode(raw));
    }
}
