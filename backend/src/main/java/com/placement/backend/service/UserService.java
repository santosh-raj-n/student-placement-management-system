package com.placement.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import com.placement.backend.dto.LoginResponse;
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

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (!"STUDENT".equals(user.getRole()) &&
                !"RECRUITER".equals(user.getRole())) {

            throw new RuntimeException("Invalid role selected");
        }

        if ("STUDENT".equals(user.getRole())) {

            if (user.getDegree() == null || user.getDegree().isBlank()) {
                throw new RuntimeException("Degree is required for students");
            }

            if (user.getDepartment() == null || user.getDepartment().isBlank()) {
                throw new RuntimeException("Department is required for students");
            }

        } else {
            user.setDegree(null);
            user.setDepartment(null);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public LoginResponse loginUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .filter(foundUser -> passwordEncoder.matches(password, foundUser.getPassword()))
                .orElse(null);

        if (user == null) {
            return null;
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(user, token);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public Optional<StudentProfileResponse> updateStudentProfile(
            Long id, UpdateStudentProfileRequest request) {
        Optional<User> foundUser = userRepository.findById(id);
        if (foundUser.isEmpty()) return Optional.empty();

        User user = foundUser.get();
        String newDegree = request.degree().trim();
        String newDepartment = request.department().trim();
        boolean academicDetailsChanged =
                !java.util.Objects.equals(user.getDegree(), newDegree)
                        || !java.util.Objects.equals(user.getDepartment(), newDepartment);

        user.setName(request.name().trim());
        user.setDegree(newDegree);
        user.setDepartment(newDepartment);
        User savedUser = userRepository.save(user);

        int deletedApplications = 0;
        if (academicDetailsChanged) {
            for (Application application : applicationRepository.findByStudentId(id)) {
                Optional<Company> foundCompany = companyRepository.findById(application.getCompanyId());
                if (foundCompany.isEmpty()) continue;

                Company company = foundCompany.get();
                boolean remainsEligible = company.isAnyDepartmentEligible()
                        || company.getEligibleDepartments().contains(newDepartment);
                boolean removableStatus = application.getStatus() == ApplicationStatus.PENDING
                        || application.getStatus() == ApplicationStatus.REJECTED;

                if (!remainsEligible && removableStatus) {
                    applicationRepository.deleteById(application.getId());
                    deletedApplications++;
                }
            }
        }

        return Optional.of(StudentProfileResponse.from(savedUser, deletedApplications));
    }

    public UserService(
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
}
