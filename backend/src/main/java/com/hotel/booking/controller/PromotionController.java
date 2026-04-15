package com.hotel.booking.controller;

import com.hotel.booking.dto.PromotionResponse;
import com.hotel.booking.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping("/validate")
    public ResponseEntity<PromotionResponse> validatePromo(@RequestParam String code) {
        return ResponseEntity.ok(promotionService.validatePromoCodeEndpoint(code));
    }
}
