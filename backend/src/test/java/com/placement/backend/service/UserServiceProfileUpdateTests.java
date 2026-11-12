package com.placement.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;

import com.placement.backend.dto.StudentProfileResponse;
import com.placement.backend.dto.UpdateStudentProfileRequest;
import com.placement.backend.model.Application;
import com.placement.backend.model.ApplicationStatus;
import com.placement.backend.model.Company;
import com.placement.backend.model.User;
import com.placement.backend.repository.ApplicationRepository;
import com.placement.backend.repository.CompanyRepository;
import com.placement.backend.repository.UserRepository;
import com.placement.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserServiceProfileUpdateTests {

    private UserRepository userRepository;
    private ApplicationRepository applicationRepository;
    private CompanyRepository companyRepository;
    private UserService userService;
    private User student;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        applicationRepository = mock(ApplicationRepository.class);
        companyRepository = mock(CompanyRepository.class);
        userService = new UserService(
                userRepository,
                applicationRepository,
                companyRepository,
                mock(PasswordEncoder.class),
                mock(JwtService.class));

        student = new User("Student One", "student@example.com", "encoded-password");
        student.setRole("STUDENT");
        student.setDegree("B.E./B.Tech");
        student.setDepartment("CSE");
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void academicChangeDeletesOnlyIneligiblePendingAndRejectedApplications() {
        Application pending = application(101L, 11L, ApplicationStatus.PENDING);
        Application rejected = application(102L, 12L, ApplicationStatus.REJECTED);
        Application accepted = application(103L, 13L, ApplicationStatus.ACCEPTED);
        Application anyDepartment = application(104L, 14L, ApplicationStatus.PENDING);
        Application civilEligible = application(105L, 15L, ApplicationStatus.REJECTED);
        Application missingCompany = application(106L, 16L, ApplicationStatus.PENDING);
        when(applicationRepository.findByStudentId(1L))
                .thenReturn(List.of(pending, rejected, accepted, anyDepartment, civilEligible, missingCompany));

        when(companyRepository.findById(11L)).thenReturn(Optional.of(restrictedCompany("CSE")));
        when(companyRepository.findById(12L)).thenReturn(Optional.of(restrictedCompany("CSE")));
        when(companyRepository.findById(13L)).thenReturn(Optional.of(restrictedCompany("CSE")));
        Company anyDepartmentCompany = new Company();
        anyDepartmentCompany.setAnyDepartmentEligible(true);
        when(companyRepository.findById(14L)).thenReturn(Optional.of(anyDepartmentCompany));
        when(companyRepository.findById(15L)).thenReturn(Optional.of(restrictedCompany("Civil")));
        when(companyRepository.findById(16L)).thenReturn(Optional.empty());

        StudentProfileResponse response = userService.updateStudentProfile(1L,
                new UpdateStudentProfileRequest("Student One", "B.E./B.Tech", "Civil")).orElseThrow();

        assertEquals("Civil", response.department());
        assertEquals(2, response.deletedApplications());
        verify(applicationRepository).deleteById(101L);
        verify(applicationRepository).deleteById(102L);
        verify(applicationRepository, never()).deleteById(103L);
        verify(applicationRepository, never()).deleteById(104L);
        verify(applicationRepository, never()).deleteById(105L);
        verify(applicationRepository, never()).deleteById(106L);
        verify(applicationRepository).findByStudentId(1L);
    }

    @Test
    void nameOnlyChangeDoesNotInspectOrDeleteApplications() {
        StudentProfileResponse response = userService.updateStudentProfile(1L,
                new UpdateStudentProfileRequest("Updated Name", "B.E./B.Tech", "CSE")).orElseThrow();

        assertEquals("Updated Name", response.name());
        assertEquals(0, response.deletedApplications());
        verify(applicationRepository, never()).findByStudentId(1L);
        verify(applicationRepository, never()).deleteById(any());
    }

    @Test
    void cleanupFailurePropagatesAndUpdateMethodIsTransactional() {
        Application pending = application(201L, 21L, ApplicationStatus.PENDING);
        when(applicationRepository.findByStudentId(1L)).thenReturn(List.of(pending));
        when(companyRepository.findById(21L)).thenReturn(Optional.of(restrictedCompany("CSE")));
        org.mockito.Mockito.doThrow(new IllegalStateException("delete failed"))
                .when(applicationRepository).deleteById(201L);

        assertThrows(IllegalStateException.class, () -> userService.updateStudentProfile(1L,
                new UpdateStudentProfileRequest("Student One", "B.E./B.Tech", "Civil")));
        try {
            assertEquals(Transactional.class,
                    UserService.class.getMethod("updateStudentProfile", Long.class,
                            UpdateStudentProfileRequest.class).getAnnotation(Transactional.class).annotationType());
        } catch (NoSuchMethodException exception) {
            throw new AssertionError(exception);
        }
    }

    private Application application(Long id, Long companyId, ApplicationStatus status) {
        Application application = mock(Application.class);
        when(application.getId()).thenReturn(id);
        when(application.getCompanyId()).thenReturn(companyId);
        when(application.getStatus()).thenReturn(status);
        return application;
    }

    private Company restrictedCompany(String department) {
        Company company = new Company();
        company.setAnyDepartmentEligible(false);
        company.setEligibleDepartments(List.of(department));
        return company;
    }
}
