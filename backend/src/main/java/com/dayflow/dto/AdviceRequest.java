package com.dayflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdviceRequest {

    @NotBlank(message = "Strengths are required")
    @Size(min = 10, message = "Strengths must be at least 10 characters")
    private String strengths;

    @NotBlank(message = "Weaknesses are required")
    @Size(min = 10, message = "Weaknesses must be at least 10 characters")
    private String weaknesses;
}
