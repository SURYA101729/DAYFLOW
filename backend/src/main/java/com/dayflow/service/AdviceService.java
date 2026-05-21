package com.dayflow.service;

import com.dayflow.dto.AdviceRequest;
import com.dayflow.model.AdviceHistory;
import com.dayflow.model.User;
import com.dayflow.repository.AdviceHistoryRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdviceService {

    private final AdviceHistoryRepository adviceHistoryRepository;
    private final UserRepository userRepository;
    private final ClaudeService claudeService;

    @Value("${app.advice.rate-limit}")
    private int rateLimit;

    public AdviceHistory getAdvice(String email, AdviceRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Rate limiting check
        LocalDateTime dayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long todayCount = adviceHistoryRepository.countByUserIdAndCreatedAtAfter(user.getId(), dayStart);
        if (todayCount >= rateLimit) {
            throw new RuntimeException("Rate limit exceeded. Maximum " + rateLimit + " advice requests per day.");
        }

        String aiResponse = claudeService.getAdvice(request.getStrengths(), request.getWeaknesses());

        AdviceHistory history = AdviceHistory.builder()
                .userId(user.getId())
                .strengths(request.getStrengths())
                .weaknesses(request.getWeaknesses())
                .aiResponse(aiResponse)
                .build();

        return adviceHistoryRepository.save(history);
    }

    public List<AdviceHistory> getHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return adviceHistoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
