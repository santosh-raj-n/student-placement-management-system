package com.placement.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.placement.backend.dto.UpdateStudentProfileRequest;
import com.placement.backend.model.Application;
import com.placement.backend.model.ApplicationStatus;
import com.placement.backend.model.Company;
import com.placement.backend.model.User;
import com.placement.backend.repository.ApplicationRepository;
import com.placement.backend.repository.CompanyRepository;
import com.placement.backend.repository.UserRepository;

@SpringBootTest
class UserProfileTransactionTests {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private ApplicationRepository applicationRepository;

    @MockitoBean
    private CompanyRepository companyRepository;

    @Test
    void cleanupFailureRollsBackProfileUpdate() {
        User student = new User("Before", "profile-" + UUID.randomUUID() + "@example.com", "encoded");
        student.setRole("STUDENT");
        student.setDegree("B.E./B.Tech");
        student.setDepartment("CSE");
        User savedStudent = userRepository.save(student);

        try {
            Application application = mock(Application.class);
            when(application.getId()).thenReturn(8001L);
            when(application.getCompanyId()).thenReturn(8002L);
            when(application.getStatus()).thenReturn(ApplicationStatus.PENDING);
            when(applicationRepository.findByStudentId(savedStudent.getId()))
                    .thenReturn(List.of(application));

            Company company = new Company();
            company.setAnyDepartmentEligible(false);
            company.setEligibleDepartments(List.of("CSE"));
            when(companyRepository.findById(8002L)).thenReturn(Optional.of(company));
            doThrow(new IllegalStateException("cleanup failed"))
                    .when(applicationRepository).deleteById(8001L);

            assertThrows(IllegalStateException.class, () -> userService.updateStudentProfile(
                    savedStudent.getId(),
                    new UpdateStudentProfileRequest("After", "B.E./B.Tech", "Civil")));

            User unchangedStudent = userRepository.findById(savedStudent.getId()).orElseThrow();
            assertEquals("Before", unchangedStudent.getName());
            assertEquals("CSE", unchangedStudent.getDepartment());
        } finally {
            userRepository.deleteById(savedStudent.getId());
        }
    }
}
