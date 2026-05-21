package com.dayflow.controller;

import com.dayflow.dto.SupportRequest;
import com.dayflow.model.SupportMessage;
import com.dayflow.service.SupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<SupportMessage> createMessage(Authentication auth,
                                                        @Valid @RequestBody SupportRequest request) {
        String email = auth != null ? auth.getName() : null;
        return ResponseEntity.ok(supportService.createMessage(email, request));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<SupportMessage>> getAllMessages(@RequestParam(required = false) String filter) {
        return ResponseEntity.ok(supportService.getAllMessages(filter));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<SupportMessage> resolveMessage(@PathVariable Long id) {
        return ResponseEntity.ok(supportService.resolveMessage(id));
    }
}
