package com.dayflow.repository;

import com.dayflow.model.AdviceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AdviceHistoryRepository extends JpaRepository<AdviceHistory, Long> {
    List<AdviceHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime after);
}
