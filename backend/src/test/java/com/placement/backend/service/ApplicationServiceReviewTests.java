package com.placement.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.placement.backend.dto.ApplicationReviewResponse;
import com.placement.backend.exception.ForbiddenException;
import com.placement.backend.model.Application;
import com.placement.backend.model.ApplicationStatus;
import com.placement.backend.model.Company;
import com.placement.backend.model.User;
import com.placement.backend.repository.ApplicationRepository;
import com.placement.backend.repository.CompanyRepository;
import com.placement.backend.repository.UserRepository;

class ApplicationServiceReviewTests {

    private ApplicationRepository applicationRepository;
    private CompanyRepository companyRepository;
    private UserRepository userRepository;
    private ApplicationService applicationService;

    @BeforeEach
    void setUp() {
        applicationRepository = mock(ApplicationRepository.class);
        companyRepository = mock(CompanyRepository.class);
        userRepository = mock(UserRepository.class);
        applicationService = new ApplicationService(
                applicationRepository, companyRepository, userRepository);
    }

    @Test
    void reviewIncludesStudentAcademicDetailsForOwnedCompany() {
        Company company = new Company(12L, "Example Corp", 2, "Pune");
        Application application = mock(Application.class);
        User student = mock(User.class);

        when(companyRepository.findByIdAndRecruiterId(12L, 30L)).thenReturn(Optional.of(company));
        when(applicationRepository.findByCompanyId(12L)).thenReturn(List.of(application));
        when(application.getId()).thenReturn(55L);
        when(application.getStudentId()).thenReturn(44L);
        when(application.getStatus()).thenReturn(ApplicationStatus.PENDING);
        when(userRepository.findById(44L)).thenReturn(Optional.of(student));
        when(student.getId()).thenReturn(44L);
        when(student.getName()).thenReturn("Alex Student");
        when(student.getEmail()).thenReturn("alex@example.com");
        when(student.getDegree()).thenReturn("B.E./B.Tech");
        when(student.getDepartment()).thenReturn("Information Technology");

        List<ApplicationReviewResponse> reviews =
                applicationService.getCompanyApplicationReviews(12L, 30L);

        assertEquals(1, reviews.size());
        assertEquals("B.E./B.Tech", reviews.get(0).getStudentDegree());
        assertEquals("Information Technology", reviews.get(0).getStudentDepartment());
        assertEquals("alex@example.com", reviews.get(0).getStudentEmail());
        assertEquals(ApplicationStatus.PENDING, reviews.get(0).getStatus());
    }

    @Test
    void recruiterCannotReviewCompanyOwnedByAnotherRecruiter() {
        when(companyRepository.findByIdAndRecruiterId(12L, 31L)).thenReturn(Optional.empty());

        assertThrows(ForbiddenException.class,
                () -> applicationService.getCompanyApplicationReviews(12L, 31L));

        verify(applicationRepository, never()).findByCompanyId(12L);
    }
}
