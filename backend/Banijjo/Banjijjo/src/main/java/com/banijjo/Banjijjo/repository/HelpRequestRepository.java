package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.HelpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {
    List<HelpRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<HelpRequest> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
}
