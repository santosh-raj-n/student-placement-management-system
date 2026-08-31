package com.placement.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.backend.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStudentIdAndCompanyId(Long studentId, Long companyId);

    List<Application> findByStudentId(Long studentId);

    List<Application> findByCompanyId(Long companyId);

    Optional<Application> findByIdAndCompanyId(
            Long applicationId,
            Long companyId);
}