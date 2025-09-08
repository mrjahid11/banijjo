package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Course;
import com.banijjo.Banjijjo.model.Enrollment;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.CourseRepository;
import com.banijjo.Banjijjo.repository.EnrollmentRepository;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*:*"}, allowCredentials = "true")
public class CoursesController {
    private final CourseRepository courseRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final UserRepository userRepo;

    public CoursesController(CourseRepository courseRepo, EnrollmentRepository enrollmentRepo, UserRepository userRepo) {
        this.courseRepo = courseRepo; this.enrollmentRepo = enrollmentRepo; this.userRepo = userRepo;
    }

    private User me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    // Public: list all courses
    @GetMapping
    public List<Course> allCourses() {
        return courseRepo.findAll();
    }

    // Public: course details
    @GetMapping("/{id}")
    public ResponseEntity<?> course(@PathVariable Long id) {
        return courseRepo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Admin: create a course
    @PostMapping("/admin/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).body("Forbidden");
        String title = String.valueOf(body.getOrDefault("title", "")).trim();
        String description = String.valueOf(body.getOrDefault("description", ""));
        String syllabus = String.valueOf(body.getOrDefault("syllabus", ""));
        String scheduleNotes = String.valueOf(body.getOrDefault("scheduleNotes", ""));
        OffsetDateTime startAt = body.get("startAt") != null ? OffsetDateTime.parse(String.valueOf(body.get("startAt"))) : null;
        OffsetDateTime endAt = body.get("endAt") != null ? OffsetDateTime.parse(String.valueOf(body.get("endAt"))) : null;
        if (title.isEmpty()) return ResponseEntity.badRequest().body("Title required");
        Course c = new Course();
        c.setTitle(title); c.setDescription(description); c.setSyllabus(syllabus); c.setScheduleNotes(scheduleNotes);
        c.setStartAt(startAt); c.setEndAt(endAt); c.setCreatedBy(u.getId());
        Course saved = courseRepo.save(c);
        return ResponseEntity.created(URI.create("/courses/" + saved.getId())).body(saved);
    }

    // Admin: list my courses
    @GetMapping("/admin/mine")
    public ResponseEntity<?> mine() {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(courseRepo.findByCreatedBy(u.getId()));
    }

    // Admin: update course
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).build();
        Course c = courseRepo.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        if (!u.getId().equals(c.getCreatedBy())) return ResponseEntity.status(403).body("Not owner");
        if (body.containsKey("title")) c.setTitle(String.valueOf(body.get("title")));
        if (body.containsKey("description")) c.setDescription(String.valueOf(body.get("description")));
        if (body.containsKey("syllabus")) c.setSyllabus(String.valueOf(body.get("syllabus")));
        if (body.containsKey("scheduleNotes")) c.setScheduleNotes(String.valueOf(body.get("scheduleNotes")));
        if (body.containsKey("startAt")) c.setStartAt(body.get("startAt") != null ? OffsetDateTime.parse(String.valueOf(body.get("startAt"))) : null);
        if (body.containsKey("endAt")) c.setEndAt(body.get("endAt") != null ? OffsetDateTime.parse(String.valueOf(body.get("endAt"))) : null);
        return ResponseEntity.ok(courseRepo.save(c));
    }

    // Admin: delete course
    @DeleteMapping("/admin/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).build();
        Course c = courseRepo.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        if (!u.getId().equals(c.getCreatedBy())) return ResponseEntity.status(403).body("Not owner");
        // Remove enrollments first
        enrollmentRepo.findByCourseId(id).forEach(enrollmentRepo::delete);
        courseRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // User: enroll in a course
    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enroll(@PathVariable Long id) {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        Course c = courseRepo.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();
        if (enrollmentRepo.findByCourseIdAndUserId(id, u.getId()).isPresent()) return ResponseEntity.badRequest().body("Already enrolled");
        Enrollment e = new Enrollment();
        e.setCourse(c); e.setUserId(u.getId());
        return ResponseEntity.created(URI.create("/courses/me")).body(enrollmentRepo.save(e));
    }

    // User: unenroll from a course
    @PostMapping("/{id}/unenroll")
    public ResponseEntity<?> unenroll(@PathVariable Long id) {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        Enrollment e = enrollmentRepo.findByCourseIdAndUserId(id, u.getId()).orElse(null);
        if (e == null) return ResponseEntity.notFound().build();
        enrollmentRepo.delete(e);
        return ResponseEntity.noContent().build();
    }

    // User: my enrollments
    @GetMapping("/me")
    public ResponseEntity<?> myCourses() {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        List<Enrollment> list = enrollmentRepo.findByUserId(u.getId());
        // Expand into simple payload
        List<Map<String, Object>> res = list.stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("enrolledAt", e.getEnrolledAt());
            m.put("course", e.getCourse());
            return m;
        }).toList();
        return ResponseEntity.ok(res);
    }
}
