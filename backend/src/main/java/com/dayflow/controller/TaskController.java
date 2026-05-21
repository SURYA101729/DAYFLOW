package com.dayflow.controller;

import com.dayflow.dto.TaskRequest;
import com.dayflow.model.Task;
import com.dayflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(Authentication auth,
                                                @RequestParam(required = false) String date) {
        if (date != null) {
            return ResponseEntity.ok(taskService.getTasksByDate(auth.getName(), LocalDate.parse(date)));
        }
        return ResponseEntity.ok(taskService.getTodayTasks(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(Authentication auth,
                                           @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(auth.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(Authentication auth,
                                           @PathVariable Long id,
                                           @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(auth.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(Authentication auth, @PathVariable Long id) {
        taskService.deleteTask(auth.getName(), id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> toggleComplete(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(taskService.toggleComplete(auth.getName(), id));
    }
}
