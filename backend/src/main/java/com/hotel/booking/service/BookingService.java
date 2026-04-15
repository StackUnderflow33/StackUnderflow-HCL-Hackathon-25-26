package com.hotel.booking.service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.BookingResponse;
import com.hotel.booking.entity.Booking;
import com.hotel.booking.entity.Room;
import com.hotel.booking.entity.User;
import com.hotel.booking.exception.BadRequestException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.entity.Promotion;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.UserRepository;
import com.hotel.booking.service.EmailService;
import com.hotel.booking.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PromotionService promotionService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getIsAvailable()) {
            throw new BadRequestException("Room is not available");
        }

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal basePrice = room.getPricePerNight().multiply(BigDecimal.valueOf(days));
        
        BigDecimal discount = BigDecimal.ZERO;
        String appliedPromo = null;

        // Apply Promotion
        if (request.getPromoCode() != null && !request.getPromoCode().isEmpty()) {
            Promotion promo = promotionService.validatePromoCode(request.getPromoCode());
            BigDecimal fraction = BigDecimal.valueOf(promo.getDiscountPercentage()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            discount = basePrice.multiply(fraction);
            appliedPromo = promo.getCode();
        }

        BigDecimal priceAfterPromo = basePrice.subtract(discount);
        if (priceAfterPromo.compareTo(BigDecimal.ZERO) < 0) priceAfterPromo = BigDecimal.ZERO;

        // Apply Loyalty Points (1 point = $1 discount)
        int pointsUsed = 0;
        int currentPoints = user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0;
        
        if (Boolean.TRUE.equals(request.getUseLoyaltyPoints()) && currentPoints > 0) {
            BigDecimal pointsBD = BigDecimal.valueOf(currentPoints);
            if (pointsBD.compareTo(priceAfterPromo) >= 0) {
                pointsUsed = priceAfterPromo.intValue();
                discount = discount.add(priceAfterPromo);
                priceAfterPromo = BigDecimal.ZERO;
            } else {
                pointsUsed = currentPoints;
                discount = discount.add(pointsBD);
                priceAfterPromo = priceAfterPromo.subtract(pointsBD);
            }
            user.setLoyaltyPoints(currentPoints - pointsUsed);
        }

        // Earn new Loyalty Points (10 points per $100 spent)
        int pointsEarned = priceAfterPromo.divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN).intValue() * 10;
        user.setLoyaltyPoints((user.getLoyaltyPoints() != null ? user.getLoyaltyPoints() : 0) + pointsEarned);

        Booking booking = Booking.builder()
                .reservationNumber(UUID.randomUUID().toString())
                .user(user)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .totalPrice(priceAfterPromo)
                .discountAmount(discount)
                .appliedPromoCode(appliedPromo)
                .pointsEarned(pointsEarned)
                .pointsUsed(pointsUsed)
                .status("CONFIRMED")
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        userRepository.save(user);

        // Simulated Email Dispatch
        emailService.sendConfirmationEmail(savedBooking);

        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .reservationNumber(booking.getReservationNumber())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName())
                .roomId(booking.getRoom().getId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .hotelName(booking.getRoom().getHotel().getName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .build();
    }
}
