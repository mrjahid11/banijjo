package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import com.banijjo.Banjijjo.model.User;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    Optional<Community> findByName(String name);
    Optional<Community> findByNameIgnoreCase(String name);
    List<Community> findAllByOwner(User owner);
}
