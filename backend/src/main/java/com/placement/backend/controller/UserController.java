package com.placement.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import jakarta.validation.Valid;
import com.placement.backend.dto.UpdateStudentProfileRequest;
import com.placement.backend.dto.StudentProfileResponse;

import com.placement.backend.dto.LoginResponse;
import com.placement.backend.model.User;
import com.placement.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody User user) {

        LoginResponse loginResponse = userService.loginUser(
                user.getEmail(),
                user.getPassword());

        if (loginResponse == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponse> profile(Authentication authentication) {
        Long userId = authenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return userService.findById(userId)
                .map(StudentProfileResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateStudentProfileRequest request) {
        Long userId = authenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return userService.updateStudentProfile(userId, request)
                .map(StudentProfileResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private Long authenticatedUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) return null;
        try {
            return Long.valueOf(authentication.getPrincipal().toString());
        } catch (NumberFormatException exception) {
            return null;
        }
    }
}
