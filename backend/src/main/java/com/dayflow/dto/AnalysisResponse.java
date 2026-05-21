package com.dayflow.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisResponse {
    private List<DailyCompletion> weeklyCompletion;
    private List<CategoryTime> categoryBreakdown;
    private List<DailyProductivity> productivityTrend;
    private long totalTasks;
    private long completedTasks;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyCompletion {
        private String day;
        private long total;
        private long completed;
        private double rate;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryTime {
        private String category;
        private long totalMinutes;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyProductivity {
        private String day;
        private long tasksCompleted;
        private long totalMinutes;
    }
}
