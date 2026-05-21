package com.dayflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String category;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "Duration is required")
    private Integer duration;

    private LocalDate taskDate;
}
