package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Comment;
import com.banijjo.Banjijjo.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByPostOrderByCreatedAtAsc(Post post);
    long countByPost(Post post);
}
