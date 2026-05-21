package com.dayflow.repository;

import com.dayflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdAndTaskDateOrderByStartTimeAsc(Long userId, LocalDate taskDate);

    List<Task> findByUserIdAndTaskDateBetweenOrderByTaskDateAscStartTimeAsc(Long userId, LocalDate start, LocalDate end);

    long countByUserIdAndTaskDateBetween(Long userId, LocalDate start, LocalDate end);

    long countByUserIdAndIsCompletedTrueAndTaskDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT t.category, SUM(t.duration) FROM Task t WHERE t.userId = :userId AND t.taskDate BETWEEN :start AND :end GROUP BY t.category")
    List<Object[]> getCategoryTimeBreakdown(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT t.taskDate, COUNT(t), SUM(CASE WHEN t.isCompleted = true THEN 1 ELSE 0 END), SUM(CASE WHEN t.isCompleted = true THEN t.duration ELSE 0 END) FROM Task t WHERE t.userId = :userId AND t.taskDate BETWEEN :start AND :end GROUP BY t.taskDate ORDER BY t.taskDate")
    List<Object[]> getDailyStats(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
