package com.dayflow.repository;

import com.dayflow.model.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    List<SupportMessage> findAllByOrderByCreatedAtDesc();
    List<SupportMessage> findByIsResolvedOrderByCreatedAtDesc(Boolean isResolved);
}
