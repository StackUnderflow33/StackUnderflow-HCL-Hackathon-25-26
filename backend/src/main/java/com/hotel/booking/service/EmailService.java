package com.hotel.booking.service;

import com.hotel.booking.entity.Booking;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendConfirmationEmail(Booking booking) {
        // Simulating the dispatch of an email
        System.out.println("==========================================================");
        System.out.println("📧 SIMULATING EMAIL DISPATCH");
        System.out.println("To: " + booking.getUser().getEmail());
        System.out.println("Subject: Your Reservation is Confirmed! (Ref: " + booking.getReservationNumber() + ")");
        System.out.println("----------------------------------------------------------");
        System.out.println("Dear " + booking.getUser().getFirstName() + " " + booking.getUser().getLastName() + ",");
        System.out.println("");
        System.out.println("Thank you for booking with LuxeStay.");
        System.out.println("Here are your reservation details:");
        System.out.println("- Hotel: " + booking.getRoom().getHotel().getName());
        System.out.println("- Room: " + booking.getRoom().getRoomNumber() + " (" + booking.getRoom().getRoomCategory().getName() + ")");
        System.out.println("- Check-In:  " + booking.getCheckInDate());
        System.out.println("- Check-Out: " + booking.getCheckOutDate());
        System.out.println("");
        System.out.println("Discount Applied: $" + booking.getDiscountAmount());
        System.out.println("Total Amount Paid: $" + booking.getTotalPrice());
        System.out.println("Loyalty Points Earned: " + booking.getPointsEarned());
        System.out.println("");
        System.out.println("We hope you enjoy your stay!");
        System.out.println("==========================================================");
    }
}
