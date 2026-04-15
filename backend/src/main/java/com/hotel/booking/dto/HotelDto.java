package com.hotel.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HotelDto {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String country;
    private Double rating;
    private String imageUrl;
    private List<String> amenities;
}
