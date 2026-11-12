package com.placement.backend.dto;

import com.placement.backend.model.User;

public record StudentProfileResponse(
        Long id,
        String name,
        String email,
        String degree,
        String department,
        String role,
        int deletedApplications) {

    public static StudentProfileResponse from(User user) {
        return from(user, 0);
    }

    public static StudentProfileResponse from(User user, int deletedApplications) {
        return new StudentProfileResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getDegree(), user.getDepartment(), user.getRole(), deletedApplications);
    }
}
