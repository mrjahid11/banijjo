package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Blog;
import com.banijjo.Banjijjo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findAllByOrderByCreatedAtDesc();
    List<Blog> findAllByAuthorOrderByCreatedAtDesc(User author);
}
