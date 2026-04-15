package com.hotel.booking.service;

import com.hotel.booking.dto.AuthResponse;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.dto.UserDto;
import com.hotel.booking.entity.Role;
import com.hotel.booking.entity.User;
import com.hotel.booking.exception.BadRequestException;
import com.hotel.booking.repository.RoleRepository;
import com.hotel.booking.repository.UserRepository;
import com.hotel.booking.security.JwtService;
import com.hotel.booking.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role User not found in DB"));

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(userRole)
                .build();

        userRepository.save(user);

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToDto(user))
                .build();
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().getName())
                .loyaltyPoints(user.getLoyaltyPoints())
                .build();
    }
}
