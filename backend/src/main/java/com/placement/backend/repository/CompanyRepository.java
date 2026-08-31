package com.placement.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.backend.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByIdAndRecruiterId(Long id, Long recruiterId);

}