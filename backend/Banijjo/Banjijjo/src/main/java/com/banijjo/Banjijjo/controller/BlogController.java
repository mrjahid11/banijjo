package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Blog;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.BlogRepository;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blog")
@CrossOrigin(origins = "http://localhost:3000")
public class BlogController {
    private final BlogRepository blogRepo;
    private final UserRepository userRepo;

    public BlogController(BlogRepository blogRepo, UserRepository userRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/all")
    public List<Map<String, Object>> listAll() {
        return blogRepo.findAllByOrderByCreatedAtDesc().stream().map(this::toSummary).toList();
    }

    @GetMapping("/mine")
    public List<Map<String, Object>> listMine() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User me = userRepo.findByEmail(auth.getName()).orElse(null);
        if (me == null) return List.of();
        return blogRepo.findAllByAuthorOrderByCreatedAtDesc(me).stream().map(this::toSummary).toList();
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
        @RequestParam("title") String title,
        @RequestParam("genre") String genre,
        @RequestParam("content") String content,
        @RequestPart(value = "photo", required = false) MultipartFile photo,
        @RequestPart(value = "document", required = false) MultipartFile document
    ) throws Exception {
        if (title == null || title.isBlank()) return ResponseEntity.badRequest().body("Title required");
        if (genre == null || genre.isBlank()) return ResponseEntity.badRequest().body("Genre required");
        if (content == null || content.isBlank()) return ResponseEntity.badRequest().body("Content required");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User me = userRepo.findByEmail(auth.getName()).orElse(null);
        if (me == null) return ResponseEntity.status(401).body("Unauthorized");

        Blog b = new Blog();
        b.setAuthor(me);
        b.setTitle(title);
        b.setGenre(genre);
        b.setContent(content);
        if (photo != null && !photo.isEmpty()) { b.setPhoto(photo.getBytes()); b.setPhotoContentType(photo.getContentType()); }
        if (document != null && !document.isEmpty()) { b.setDocument(document.getBytes()); b.setDocumentContentType(document.getContentType()); }
        Blog saved = blogRepo.save(b);
        return ResponseEntity.created(URI.create("/blog/" + saved.getId())).body(toSummary(saved));
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> photo(@PathVariable Long id) {
        Blog b = blogRepo.findById(id).orElse(null);
        if (b == null || b.getPhoto() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, b.getPhotoContentType() != null ? b.getPhotoContentType() : MediaType.IMAGE_JPEG_VALUE)
                .body(b.getPhoto());
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<byte[]> document(@PathVariable Long id) {
        Blog b = blogRepo.findById(id).orElse(null);
        if (b == null || b.getDocument() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, b.getDocumentContentType() != null ? b.getDocumentContentType() : MediaType.APPLICATION_PDF_VALUE)
                .body(b.getDocument());
    }

    private Map<String, Object> toSummary(Blog b) {
        return Map.of(
                "id", b.getId(),
                "title", b.getTitle(),
                "genre", b.getGenre(),
                "content", b.getContent(),
                "createdAt", b.getCreatedAt(),
                "author", Map.of("id", b.getAuthor().getId(), "name", b.getAuthor().getName(), "email", b.getAuthor().getEmail()),
                "hasPhoto", b.getPhoto() != null,
                "hasDocument", b.getDocument() != null
        );
    }
}
