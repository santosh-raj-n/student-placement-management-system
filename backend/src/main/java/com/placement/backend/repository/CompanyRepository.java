package com.placement.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.backend.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}