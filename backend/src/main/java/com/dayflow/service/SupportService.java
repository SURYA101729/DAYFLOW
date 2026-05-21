package com.dayflow.service;

import com.dayflow.dto.SupportRequest;
import com.dayflow.model.SupportMessage;
import com.dayflow.model.User;
import com.dayflow.repository.SupportMessageRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportMessageRepository supportMessageRepository;
    private final UserRepository userRepository;

    public SupportMessage createMessage(String email, SupportRequest request) {
        Long userId = null;
        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) userId = user.getId();
        }

        SupportMessage message = SupportMessage.builder()
                .userId(userId)
                .name(request.getName().trim())
                .email(request.getEmail().trim())
                .subject(request.getSubject().trim())
                .message(request.getMessage().trim())
                .isResolved(false)
                .build();

        return supportMessageRepository.save(message);
    }

    public List<SupportMessage> getAllMessages(String filter) {
        if ("resolved".equalsIgnoreCase(filter)) {
            return supportMessageRepository.findByIsResolvedOrderByCreatedAtDesc(true);
        } else if ("unresolved".equalsIgnoreCase(filter)) {
            return supportMessageRepository.findByIsResolvedOrderByCreatedAtDesc(false);
        }
        return supportMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public SupportMessage resolveMessage(Long id) {
        SupportMessage message = supportMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsResolved(!message.getIsResolved());
        return supportMessageRepository.save(message);
    }
}
