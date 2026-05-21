package com.dayflow.service;

import com.dayflow.dto.TaskRequest;
import com.dayflow.model.Task;
import com.dayflow.model.User;
import com.dayflow.repository.TaskRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> getTodayTasks(String email) {
        User user = getUserByEmail(email);
        return taskRepository.findByUserIdAndTaskDateOrderByStartTimeAsc(user.getId(), LocalDate.now());
    }

    public List<Task> getTasksByDate(String email, LocalDate date) {
        User user = getUserByEmail(email);
        return taskRepository.findByUserIdAndTaskDateOrderByStartTimeAsc(user.getId(), date);
    }

    public Task createTask(String email, TaskRequest request) {
        User user = getUserByEmail(email);

        Task task = Task.builder()
                .userId(user.getId())
                .title(request.getTitle().trim())
                .category(request.getCategory() != null ? Task.Category.valueOf(request.getCategory()) : Task.Category.Other)
                .startTime(request.getStartTime())
                .duration(request.getDuration())
                .isCompleted(false)
                .taskDate(request.getTaskDate() != null ? request.getTaskDate() : LocalDate.now())
                .build();

        return taskRepository.save(task);
    }

    public Task updateTask(String email, Long taskId, TaskRequest request) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this task");
        }

        task.setTitle(request.getTitle().trim());
        if (request.getCategory() != null) {
            task.setCategory(Task.Category.valueOf(request.getCategory()));
        }
        task.setStartTime(request.getStartTime());
        task.setDuration(request.getDuration());
        if (request.getTaskDate() != null) {
            task.setTaskDate(request.getTaskDate());
        }

        return taskRepository.save(task);
    }

    public void deleteTask(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this task");
        }

        taskRepository.delete(task);
    }

    public Task toggleComplete(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this task");
        }

        task.setIsCompleted(!task.getIsCompleted());
        return taskRepository.save(task);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
