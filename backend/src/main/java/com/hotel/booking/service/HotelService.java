package com.hotel.booking.service;

import com.hotel.booking.dto.HotelDto;
import com.hotel.booking.dto.RoomDto;
import com.hotel.booking.entity.Amenity;
import com.hotel.booking.entity.Hotel;
import com.hotel.booking.entity.Room;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.HotelRepository;
import com.hotel.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public List<HotelDto> getAllHotels() {
        return hotelRepository.findAll().stream()
                .map(this::mapToHotelDto)
                .collect(Collectors.toList());
    }

    public List<HotelDto> searchHotels(String location) {
        return hotelRepository.findByCityContainingIgnoreCaseOrCountryContainingIgnoreCase(location, location).stream()
                .map(this::mapToHotelDto)
                .collect(Collectors.toList());
    }

    public HotelDto getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + id));
        return mapToHotelDto(hotel);
    }

    public List<HotelDto> advancedSearch(String location, String checkIn, String checkOut, BigDecimal minPrice, BigDecimal maxPrice, List<String> amenities) {
        LocalDate cIn = (checkIn != null && !checkIn.isEmpty()) ? LocalDate.parse(checkIn) : LocalDate.now();
        LocalDate cOut = (checkOut != null && !checkOut.isEmpty()) ? LocalDate.parse(checkOut) : LocalDate.now().plusDays(1);
        
        // Ensure valid date range
        if (cOut.isBefore(cIn) || cOut.isEqual(cIn)) {
            cOut = cIn.plusDays(1);
        }

        List<Hotel> hotels = hotelRepository.findAdvanced(
            (location != null && !location.trim().isEmpty()) ? location.trim() : null,
            minPrice,
            maxPrice,
            cIn,
            cOut
        );

        return hotels.stream()
                .filter(hotel -> hasAllAmenities(hotel, amenities))
                .map(this::mapToHotelDto)
                .collect(Collectors.toList());
    }

    private boolean hasAllAmenities(Hotel hotel, List<String> requiredAmenities) {
        if (requiredAmenities == null || requiredAmenities.isEmpty()) return true;
        List<String> hotelAmenities = hotel.getAmenities().stream()
                .map(Amenity::getName)
                .collect(Collectors.toList());
        return hotelAmenities.containsAll(requiredAmenities);
    }

    public List<RoomDto> getHotelRooms(Long hotelId) {
        // verify hotel exists
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
        }
        
        return roomRepository.findByHotelId(hotelId).stream()
                .map(this::mapToRoomDto)
                .collect(Collectors.toList());
    }

    public List<RoomDto> getAvailableHotelRooms(Long hotelId) {
        return roomRepository.findByHotelIdAndIsAvailableTrue(hotelId).stream()
                .map(this::mapToRoomDto)
                .collect(Collectors.toList());
    }

    private HotelDto mapToHotelDto(Hotel hotel) {
        return HotelDto.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .country(hotel.getCountry())
                .rating(hotel.getRating())
                .imageUrl(hotel.getImageUrl())
                .amenities(hotel.getAmenities().stream().map(Amenity::getName).collect(Collectors.toList()))
                .build();
    }

    private RoomDto mapToRoomDto(Room room) {
        return RoomDto.builder()
                .id(room.getId())
                .hotelId(room.getHotel().getId())
                .roomCategory(room.getRoomCategory().getName())
                .roomCategoryDescription(room.getRoomCategory().getDescription())
                .roomNumber(room.getRoomNumber())
                .pricePerNight(room.getPricePerNight())
                .capacity(room.getCapacity())
                .isAvailable(room.getIsAvailable())
                .imageUrl(room.getImageUrl())
                .build();
    }
}
