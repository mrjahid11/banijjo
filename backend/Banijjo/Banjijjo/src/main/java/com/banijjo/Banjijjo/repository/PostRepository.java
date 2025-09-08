package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Post;
import com.banijjo.Banjijjo.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByCommunityOrderByCreatedAtDesc(Community community);
    List<Post> findAllByOrderByCreatedAtDesc();
}
