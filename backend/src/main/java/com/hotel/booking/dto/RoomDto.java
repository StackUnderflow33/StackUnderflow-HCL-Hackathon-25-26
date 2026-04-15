package com.hotel.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomDto {
    private Long id;
    private Long hotelId;
    private String roomCategory;
    private String roomCategoryDescription;
    private String roomNumber;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private Boolean isAvailable;
    private String imageUrl;
}
