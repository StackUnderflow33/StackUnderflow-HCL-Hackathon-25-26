package com.hotel.booking.service;

import com.hotel.booking.dto.PromotionResponse;
import com.hotel.booking.entity.Promotion;
import com.hotel.booking.exception.BadRequestException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public Promotion validatePromoCode(String code) {
        Promotion promo = promotionRepository.findByCodeIgnoreCaseAndIsActiveTrue(code)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion code not found or inactive"));

        LocalDate today = LocalDate.now();
        if (promo.getValidFrom() != null && today.isBefore(promo.getValidFrom())) {
            throw new BadRequestException("Promotion code is not yet valid");
        }
        if (promo.getValidUntil() != null && today.isAfter(promo.getValidUntil())) {
            throw new BadRequestException("Promotion code has expired");
        }

        return promo;
    }

    public PromotionResponse validatePromoCodeEndpoint(String code) {
        Promotion promo = validatePromoCode(code);
        return PromotionResponse.builder()
                .code(promo.getCode())
                .discountPercentage(promo.getDiscountPercentage())
                .build();
    }
}
