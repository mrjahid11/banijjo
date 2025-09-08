package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.dto.CommunityDtos.CreateCommunityRequest;
import com.banijjo.Banjijjo.dto.CommunityDtos.CreatePostRequest;
import com.banijjo.Banjijjo.model.*;
import com.banijjo.Banjijjo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/community")
@CrossOrigin(origins = "http://localhost:3000")
public class CommunityController {
    private final CommunityRepository communityRepo;
    private final PostRepository postRepo;
    private final CommentRepository commentRepo;
    private final PostLikeRepository likeRepo;
    private final UserRepository userRepo;

    public CommunityController(CommunityRepository communityRepo, PostRepository postRepo, CommentRepository commentRepo, PostLikeRepository likeRepo, UserRepository userRepo) {
        this.communityRepo = communityRepo; this.postRepo = postRepo; this.commentRepo = commentRepo; this.likeRepo = likeRepo; this.userRepo = userRepo;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCommunity(@RequestBody CreateCommunityRequest req) {
        String name = req.name == null ? null : req.name.trim();
        String description = req.description == null ? null : req.description.trim();
        if (name == null || name.isBlank()) return ResponseEntity.badRequest().body("Name required");
        if (name.length() < 3) return ResponseEntity.badRequest().body("Name must be at least 3 characters");
    if (communityRepo.findByNameIgnoreCase(name).isPresent()) return ResponseEntity.badRequest().body("Community name already exists");
        // Prefer authenticated user as owner; fall back to provided id for legacy clients
        User owner = getAuthenticatedUser().orElseGet(() -> req.ownerId != null ? userRepo.findById(req.ownerId).orElse(null) : null);
        if (owner == null) return ResponseEntity.status(401).body("Please sign in again to create a community.");
        Community c = new Community();
        c.setName(name); c.setDescription(description); c.setOwner(owner);
        Community saved = communityRepo.save(c);
        return ResponseEntity.created(URI.create("/community/" + saved.getId())).body(saved);
    }

    @GetMapping("/all")
    public List<Community> listCommunities() { return communityRepo.findAll(); }

    @GetMapping("/mine")
    public ResponseEntity<?> myCommunities(@RequestParam(required = false) Long ownerId) {
        User owner = getAuthenticatedUser().orElseGet(() -> ownerId != null ? userRepo.findById(ownerId).orElse(null) : null);
        if (owner == null) return ResponseEntity.badRequest().body("Owner not found");
        return ResponseEntity.ok(communityRepo.findAllByOwner(owner));
    }

    @PostMapping("/post")
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest req) {
    // Prefer authenticated user as author
    User author = getAuthenticatedUser().orElseGet(() -> userRepo.findById(req.authorId).orElse(null));
        if (author == null) return ResponseEntity.badRequest().body("Author not found");
        Community community = communityRepo.findById(req.communityId).orElse(null);
        if (community == null) return ResponseEntity.badRequest().body("Community not found");
        Post p = new Post(); p.setAuthor(author); p.setCommunity(community); p.setContent(req.content);
        Post saved = postRepo.save(p);
        return ResponseEntity.created(URI.create("/community/post/" + saved.getId())).body(saved);
    }

    @GetMapping("/newsfeed")
    public List<Map<String, Object>> newsfeed() {
        List<Post> posts = postRepo.findAllByOrderByCreatedAtDesc();
        return posts.stream().map(p -> Map.of(
                "id", p.getId(),
                "content", p.getContent(),
                "createdAt", p.getCreatedAt(),
                "author", p.getAuthor(),
                "community", p.getCommunity(),
                "likeCount", likeRepo.countByPost(p)
        )).toList();
    }

    @PostMapping("/comment")
    public ResponseEntity<?> addComment(@RequestBody Map<String, Object> body) {
        Long postId = ((Number) body.get("postId")).longValue();
        Long authorId = ((Number) body.get("authorId")).longValue();
        String content = (String) body.get("content");
        if (content == null || content.isBlank()) return ResponseEntity.badRequest().body("Content required");
        Post post = postRepo.findById(postId).orElse(null);
        if (post == null) return ResponseEntity.badRequest().body("Post not found");
        User author = userRepo.findById(authorId).orElse(null);
        if (author == null) return ResponseEntity.badRequest().body("Author not found");
        Comment c = new Comment(); c.setPost(post); c.setAuthor(author); c.setContent(content);
        return ResponseEntity.created(URI.create("/community/comment")).body(commentRepo.save(c));
    }

    @PostMapping("/like")
    public ResponseEntity<?> like(@RequestBody Map<String, Object> body) {
        Long postId = ((Number) body.get("postId")).longValue();
        Long userId = ((Number) body.get("userId")).longValue();
        Post post = postRepo.findById(postId).orElse(null);
        if (post == null) return ResponseEntity.badRequest().body("Post not found");
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");
        return likeRepo.findByPostAndUser(post, user)
                .<ResponseEntity<?>>map(pl -> ResponseEntity.ok(pl))
                .orElseGet(() -> ResponseEntity.created(URI.create("/community/like")).body(likeRepo.save(newLike(post, user))));
    }

    @GetMapping("/post/{id}/likes")
    public ResponseEntity<?> likeCount(@PathVariable Long id) {
        Post post = postRepo.findById(id).orElse(null);
        if (post == null) return ResponseEntity.notFound().build();
        long count = likeRepo.countByPost(post);
        return ResponseEntity.ok(Map.of("postId", id, "likes", count));
    }

    @GetMapping("/post/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        Post post = postRepo.findById(id).orElse(null);
        if (post == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(commentRepo.findAllByPostOrderByCreatedAtAsc(post));
    }

    private PostLike newLike(Post post, User user) {
        PostLike pl = new PostLike(); pl.setPost(post); pl.setUser(user); return pl;
    }

    private java.util.Optional<User> getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return java.util.Optional.empty();
        return userRepo.findByEmail(auth.getName());
    }
}
