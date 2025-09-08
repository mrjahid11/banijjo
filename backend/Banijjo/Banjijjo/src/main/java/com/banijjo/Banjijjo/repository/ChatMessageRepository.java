package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.ChatMessage;
import com.banijjo.Banjijjo.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByCompanyOrderBySentAtAsc(Company company);
    List<ChatMessage> findByCompanyAndSenderIdOrCompanyAndRecipientIdOrderBySentAtAsc(Company c1, Long senderId, Company c2, Long recipientId);
}
