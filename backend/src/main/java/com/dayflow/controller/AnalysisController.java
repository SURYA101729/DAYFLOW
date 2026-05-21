package com.dayflow.controller;

import com.dayflow.dto.AnalysisResponse;
import com.dayflow.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @GetMapping
    public ResponseEntity<AnalysisResponse> getAnalysis(Authentication auth,
                                                         @RequestParam(required = false, defaultValue = "week") String range) {
        return ResponseEntity.ok(analysisService.getAnalysis(auth.getName(), range));
    }
}
