package com.dayflow.service;

import com.dayflow.dto.AnalysisResponse;
import com.dayflow.model.User;
import com.dayflow.repository.TaskRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public AnalysisResponse getAnalysis(String email, String range) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate end = LocalDate.now();
        LocalDate start;

        switch (range != null ? range.toLowerCase() : "week") {
            case "month":
                start = end.minusDays(30);
                break;
            case "all":
                start = end.minusYears(1);
                break;
            default:
                start = end.minusDays(7);
        }

        long totalTasks = taskRepository.countByUserIdAndTaskDateBetween(user.getId(), start, end);
        long completedTasks = taskRepository.countByUserIdAndIsCompletedTrueAndTaskDateBetween(user.getId(), start, end);

        // Daily stats for bar chart and line chart
        List<Object[]> dailyStats = taskRepository.getDailyStats(user.getId(), start, end);
        List<AnalysisResponse.DailyCompletion> weeklyCompletion = new ArrayList<>();
        List<AnalysisResponse.DailyProductivity> productivityTrend = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        for (Object[] row : dailyStats) {
            LocalDate date = (LocalDate) row[0];
            long total = (Long) row[1];
            long completed = (Long) row[2];
            long minutes = row[3] != null ? (Long) row[3] : 0;
            double rate = total > 0 ? (double) completed / total * 100 : 0;

            weeklyCompletion.add(new AnalysisResponse.DailyCompletion(
                    date.format(formatter), total, completed, Math.round(rate * 10.0) / 10.0));

            productivityTrend.add(new AnalysisResponse.DailyProductivity(
                    date.format(formatter), completed, minutes));
        }

        // Category breakdown for pie chart
        List<Object[]> categoryData = taskRepository.getCategoryTimeBreakdown(user.getId(), start, end);
        List<AnalysisResponse.CategoryTime> categoryBreakdown = new ArrayList<>();

        for (Object[] row : categoryData) {
            String category = row[0] != null ? row[0].toString() : "Other";
            long minutes = row[1] != null ? (Long) row[1] : 0;
            categoryBreakdown.add(new AnalysisResponse.CategoryTime(category, minutes));
        }

        return AnalysisResponse.builder()
                .weeklyCompletion(weeklyCompletion)
                .categoryBreakdown(categoryBreakdown)
                .productivityTrend(productivityTrend)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .build();
    }
}
