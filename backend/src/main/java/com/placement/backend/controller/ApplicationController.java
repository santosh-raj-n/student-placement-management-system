package com.placement.backend.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.backend.model.Application;
import com.placement.backend.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public Application apply(
            @RequestBody Application application,
            Authentication authentication) {

        Long studentId = Long.parseLong(authentication.getName());

        return applicationService.apply(
                studentId,
                application.getCompanyId());
    }

    @GetMapping("/my")
    public List<Application> getMyApplications(
            Authentication authentication) {

        Long studentId = Long.parseLong(authentication.getName());

        return applicationService.getMyApplications(studentId);
    }

    @GetMapping("/company/{companyId}")
    public List<Application> getCompanyApplications(
            @PathVariable Long companyId,
            Authentication authentication) {

        Long recruiterId = Long.parseLong(authentication.getName());

        return applicationService.getCompanyApplications(
                companyId,
                recruiterId);
    }

    @PutMapping("/company/{companyId}/application/{applicationId}")
    public Application updateApplicationStatus(
            @PathVariable Long companyId,
            @PathVariable Long applicationId,
            @RequestBody Application application,
            Authentication authentication) {

        Long recruiterId = Long.parseLong(authentication.getName());

        return applicationService.updateApplicationStatus(
                applicationId,
                companyId,
                recruiterId,
                application.getStatus());
    }
}