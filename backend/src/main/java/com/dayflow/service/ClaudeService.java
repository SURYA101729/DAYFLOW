package com.dayflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class ClaudeService {

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.url}")
    private String apiUrl;

    @Value("${claude.api.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getAdvice(String strengths, String weaknesses) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            String prompt = String.format("""
                You are a life coach and personal development expert. A user has shared:
                
                **Strengths:** %s
                **Weaknesses:** %s
                
                Please provide structured, actionable advice in the following format:
                
                ## 🎯 Areas Needing Improvement
                [Identify 3-4 specific areas based on their weaknesses]
                
                ## 🛡️ Handling Daily Life Crises
                [Practical strategies for managing stress and daily challenges]
                
                ## 💪 Overcoming Weaknesses
                [Personalized steps to address each weakness mentioned]
                
                ## 🚀 Leveraging Your Strengths
                [Action steps to maximize and build upon their strengths]
                
                ## 📋 Daily Action Plan
                [A simple 5-step daily routine they can start today]
                
                Keep the tone encouraging, practical, and empathetic. Use bullet points for clarity.
                """, strengths, weaknesses);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("max_tokens", 2048);

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);

            requestBody.put("messages", messages);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode content = root.path("content");
            if (content.isArray() && content.size() > 0) {
                return content.get(0).path("text").asText();
            }

            return "Unable to generate advice at this time. Please try again.";

        } catch (Exception e) {
            log.error("Claude API call failed: {}", e.getMessage());
            throw new RuntimeException("AI advice service is temporarily unavailable. Please try again later.");
        }
    }
}
