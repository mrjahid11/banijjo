package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.PostLike;
import com.banijjo.Banjijjo.model.Post;
import com.banijjo.Banjijjo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
    long countByPost(Post post);
}
