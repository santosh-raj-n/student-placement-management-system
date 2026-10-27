package com.placement.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.backend.dto.ApplicationReviewResponse;
import com.placement.backend.exception.ForbiddenException;
import com.placement.backend.model.Application;
import com.placement.backend.model.ApplicationStatus;
import com.placement.backend.model.Company;
import com.placement.backend.model.User;
import com.placement.backend.repository.ApplicationRepository;
import com.placement.backend.repository.CompanyRepository;
import com.placement.backend.repository.UserRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            CompanyRepository companyRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
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

    public List<ApplicationReviewResponse> getCompanyApplicationReviews(
            Long companyId,
            Long recruiterId) {

        // Verify that the recruiter owns this company
        Company company = companyRepository
                .findByIdAndRecruiterId(companyId, recruiterId)
                .orElseThrow(() -> new ForbiddenException(
                        "Company not found or you do not have permission to view its applications"));

        List<Application> applications = applicationRepository.findByCompanyId(companyId);

        List<ApplicationReviewResponse> reviews = new ArrayList<>();

        for (Application application : applications) {

            User student = userRepository
                    .findById(application.getStudentId())
                    .orElseThrow(() -> new RuntimeException(
                            "Student not found"));

            ApplicationReviewResponse review = new ApplicationReviewResponse(
                    application.getId(),
                    student.getId(),
                    student.getName(),
                    student.getEmail(),
                    company.getId(),
                    company.getName(),
                    application.getStatus());

            reviews.add(review);
        }

        return reviews;
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