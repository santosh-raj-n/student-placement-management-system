package com.placement.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.backend.exception.ForbiddenException;
import com.placement.backend.model.Application;
import com.placement.backend.model.ApplicationStatus;
import com.placement.backend.repository.ApplicationRepository;
import com.placement.backend.repository.CompanyRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            CompanyRepository companyRepository) {

        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
    }

    public Application apply(Long studentId, Long companyId) {

        boolean alreadyApplied = applicationRepository
                .existsByStudentIdAndCompanyId(studentId, companyId);

        if (alreadyApplied) {
            throw new RuntimeException("You have already applied to this company");
        }

        Application application = new Application(
                studentId,
                companyId,
                ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getCompanyApplications(
            Long companyId,
            Long recruiterId) {

        companyRepository
                .findByIdAndRecruiterId(companyId, recruiterId)
                .orElseThrow(() -> new ForbiddenException(
                        "Company not found or you do not have permission to view its applications"));

        return applicationRepository.findByCompanyId(companyId);
    }

    public Application updateApplicationStatus(
            Long applicationId,
            Long companyId,
            Long recruiterId,
            ApplicationStatus status) {

        // First verify that this recruiter owns the company
        companyRepository
                .findByIdAndRecruiterId(companyId, recruiterId)
                .orElseThrow(() -> new ForbiddenException(
                        "Company not found or you do not have permission to manage applications"));

        // Then verify that the application belongs to this company
        Application application = applicationRepository
                .findByIdAndCompanyId(applicationId, companyId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}