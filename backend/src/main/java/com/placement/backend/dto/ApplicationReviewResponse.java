
package com.placement.backend.dto;

import com.placement.backend.model.ApplicationStatus;

public class ApplicationReviewResponse {

    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentDegree;
    private String studentDepartment;
    private Long companyId;
    private String companyName;
    private ApplicationStatus status;

    public ApplicationReviewResponse(
            Long applicationId,
            Long studentId,
            String studentName,
            String studentEmail,
            String studentDegree,
            String studentDepartment,
            Long companyId,
            String companyName,
            ApplicationStatus status) {

        this.applicationId = applicationId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentDegree = studentDegree;
        this.studentDepartment = studentDepartment;
        this.companyId = companyId;
        this.companyName = companyName;
        this.status = status;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public String getStudentDegree() {
        return studentDegree;
    }

    public String getStudentDepartment() {
        return studentDepartment;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }
}
