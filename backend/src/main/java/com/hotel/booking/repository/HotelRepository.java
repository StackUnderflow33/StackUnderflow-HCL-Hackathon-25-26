package com.hotel.booking.repository;

import com.hotel.booking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityContainingIgnoreCaseOrCountryContainingIgnoreCase(String city, String country);

    @Query("SELECT DISTINCT r.hotel FROM Room r WHERE " +
       "(:location IS NULL OR LOWER(r.hotel.city) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(r.hotel.country) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(r.hotel.address) LIKE LOWER(CONCAT('%', :location, '%'))) " +
       "AND (:minPrice IS NULL OR r.pricePerNight >= :minPrice) " +
       "AND (:maxPrice IS NULL OR r.pricePerNight <= :maxPrice) " +
       "AND r.isAvailable = true " +
       "AND r.id NOT IN (SELECT b.room.id FROM Booking b WHERE ((b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)) AND b.status = 'CONFIRMED')")
    List<Hotel> findAdvanced(@Param("location") String location, 
                             @Param("minPrice") BigDecimal minPrice, 
                             @Param("maxPrice") BigDecimal maxPrice, 
                             @Param("checkInDate") LocalDate checkInDate, 
                             @Param("checkOutDate") LocalDate checkOutDate);
}
