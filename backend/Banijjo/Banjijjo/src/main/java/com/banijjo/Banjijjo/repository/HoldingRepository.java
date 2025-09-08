package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Holding;
import com.banijjo.Banjijjo.model.HoldingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    List<Holding> findByOwnerId(Long ownerId);
    List<Holding> findByStatusAndOwnerIdNot(HoldingStatus status, Long ownerId);
}
