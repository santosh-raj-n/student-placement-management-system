package com.placement.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.backend.model.Company;
import com.placement.backend.service.CompanyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public List<Company> getCompanies() {
        return companyService.getCompanies();
    }

    @PostMapping
    public Company createCompany(@Valid @RequestBody Company company) {
        return companyService.createCompany(company);
    }

    @PutMapping("/{id}")
    public Company updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody Company company) {

        return companyService.updateCompany(id, company);
    }

    @DeleteMapping("/{id}")
    public void deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
    }
}