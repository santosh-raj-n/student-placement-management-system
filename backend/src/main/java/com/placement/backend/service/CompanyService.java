package com.placement.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.backend.exception.ForbiddenException;
import com.placement.backend.model.Company;
import com.placement.backend.repository.CompanyRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> getCompanies() {
        return companyRepository.findAll();
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company updateCompany(
            Long id,
            Long recruiterId,
            Company updatedCompany) {

        Company existingCompany = companyRepository
                .findByIdAndRecruiterId(id, recruiterId)
                .orElseThrow(() -> new ForbiddenException(
                        "Company not found or you do not have permission to update it"));

        existingCompany.setName(updatedCompany.getName());
        existingCompany.setLocation(updatedCompany.getLocation());
        existingCompany.setOpenings(updatedCompany.getOpenings());
        existingCompany.setPackageAmount(updatedCompany.getPackageAmount());

        return companyRepository.save(existingCompany);
    }

    public void deleteCompany(Long id, Long recruiterId) {

        Company existingCompany = companyRepository
                .findByIdAndRecruiterId(id, recruiterId)
                .orElseThrow(() -> new ForbiddenException(
                        "Company not found or you do not have permission to delete it"));

        companyRepository.delete(existingCompany);
    }
}