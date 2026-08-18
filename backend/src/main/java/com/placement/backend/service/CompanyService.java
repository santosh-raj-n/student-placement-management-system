package com.placement.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

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

    public Company updateCompany(Long id, Company updatedCompany) {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        existingCompany.setName(updatedCompany.getName());
        existingCompany.setLocation(updatedCompany.getLocation());
        existingCompany.setOpenings(updatedCompany.getOpenings());
        existingCompany.setPackageAmount(updatedCompany.getPackageAmount());

        return companyRepository.save(existingCompany);
    }

    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Company not found");
        }
        companyRepository.deleteById(id);
    }
}