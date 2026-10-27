package com.placement.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    private String name;

    @Min(value = 1, message = "Openings must be at least 1")
    private int openings;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Package amount is required")
    @Min(value = 0, message = "Package amount cannot be negative")
    private Double packageAmount;

    private Long recruiterId;

    @ElementCollection
    private List<String> eligibleDepartments = new ArrayList<>();

    private boolean anyDepartmentEligible = true;

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }

    public Company() {
    }

    public Company(Long id, String name, int openings, String location) {
        this.id = id;
        this.name = name;
        this.openings = openings;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getOpenings() {
        return openings;
    }

    public void setOpenings(int openings) {
        this.openings = openings;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getPackageAmount() {
        return packageAmount;
    }

    public void setPackageAmount(Double packageAmount) {
        this.packageAmount = packageAmount;
    }

    public List<String> getEligibleDepartments() {
        return eligibleDepartments;
    }

    public void setEligibleDepartments(List<String> eligibleDepartments) {
        this.eligibleDepartments = eligibleDepartments;
    }

    public boolean isAnyDepartmentEligible() {
        return anyDepartmentEligible;
    }

    public void setAnyDepartmentEligible(boolean anyDepartmentEligible) {
        this.anyDepartmentEligible = anyDepartmentEligible;
    }
}