package com.hotel.booking.controller;

import com.hotel.booking.dto.HotelDto;
import com.hotel.booking.dto.RoomDto;
import com.hotel.booking.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<HotelDto>> getAllHotels(
            @RequestParam(required = false) String location
    ) {
        if (location != null && !location.isBlank()) {
            return ResponseEntity.ok(hotelService.searchHotels(location));
        }
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    // Deprecated simple search, keeping for backward auth but delegating or keeping
    @GetMapping(params = "location")
    public ResponseEntity<List<HotelDto>> searchHotels(@RequestParam String location) {
        return ResponseEntity.ok(hotelService.searchHotels(location));
    }

    @GetMapping("/advanced-search")
    public ResponseEntity<List<HotelDto>> advancedSearch(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) List<String> amenities) {
        return ResponseEntity.ok(hotelService.advancedSearch(location, checkIn, checkOut, minPrice, maxPrice, amenities));
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomDto>> getHotelRooms(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelRooms(id));
    }

    @GetMapping("/{id}/rooms/available")
    public ResponseEntity<List<RoomDto>> getAvailableHotelRooms(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getAvailableHotelRooms(id));
    }
}
