package com.hotel.booking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PromotionResponse {
    private String code;
    private Integer discountPercentage;
}
