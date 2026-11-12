package com.placement.backend.dto;

import com.placement.backend.model.User;

public record StudentProfileResponse(
        Long id,
        String name,
        String email,
        String degree,
        String department,
        String role) {

    public static StudentProfileResponse from(User user) {
        return new StudentProfileResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getDegree(), user.getDepartment(), user.getRole());
    }
}
