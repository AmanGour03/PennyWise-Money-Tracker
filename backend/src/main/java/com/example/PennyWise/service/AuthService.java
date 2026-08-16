package com.example.PennyWise.service;

import com.example.PennyWise.dto.AuthResponse;
import com.example.PennyWise.dto.LoginRequest;
import com.example.PennyWise.dto.RegisterRequest;
import com.example.PennyWise.model.Role;
import com.example.PennyWise.model.User;
import com.example.PennyWise.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

// REGISTER

    public AuthResponse register(
            RegisterRequest request
    ) {
        if (userRepo.existsByUsername(request.getUsername())) { throw new RuntimeException("Username already exists");}

        if (userRepo.existsByEmail( request.getEmail())) { throw new RuntimeException("Email already exists");}

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default role
        user.setRole(Role.USER);

        userRepo.save(user);
        return new AuthResponse(
                "User registered successfully",
                null
        );
    }

    // LOGIN

    public AuthResponse login(
            LoginRequest request
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );


        User user =
                userRepo
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        String token =
                jwtService.generateToken(
                        user.getUsername()
                );
        return new AuthResponse(
                "Login successful",
                token
        );
    }
}