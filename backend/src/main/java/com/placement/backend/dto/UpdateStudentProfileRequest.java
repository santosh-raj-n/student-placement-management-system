package com.placement.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStudentProfileRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Degree is required") String degree,
        @NotBlank(message = "Department is required") String department) {
}
