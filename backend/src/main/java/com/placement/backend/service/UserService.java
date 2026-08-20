package com.placement.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.placement.backend.dto.LoginResponse;
import com.placement.backend.model.User;
import com.placement.backend.repository.UserRepository;
import com.placement.backend.security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public LoginResponse loginUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .filter(foundUser -> passwordEncoder.matches(password, foundUser.getPassword()))
                .orElse(null);

        if (user == null) {
            return null;
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(user, token);
    }

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
}