package com.dayflow.controller;

import com.dayflow.dto.AdviceRequest;
import com.dayflow.model.AdviceHistory;
import com.dayflow.service.AdviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advice")
@RequiredArgsConstructor
public class AdviceController {

    private final AdviceService adviceService;

    @PostMapping
    public ResponseEntity<AdviceHistory> getAdvice(Authentication auth,
                                                   @Valid @RequestBody AdviceRequest request) {
        return ResponseEntity.ok(adviceService.getAdvice(auth.getName(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AdviceHistory>> getHistory(Authentication auth) {
        return ResponseEntity.ok(adviceService.getHistory(auth.getName()));
    }
}
