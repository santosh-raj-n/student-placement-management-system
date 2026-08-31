package com.placement.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "student_id", "company_id" })
})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Long companyId;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    public Application() {
    }

    public Application(Long studentId, Long companyId, ApplicationStatus status) {
        this.studentId = studentId;
        this.companyId = companyId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}