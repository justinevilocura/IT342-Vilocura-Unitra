package edu.cit.vilocura.unitra.features.community;

import edu.cit.vilocura.unitra.features.community.Comment;
import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.community.CommentRepository;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(CommentController.class.getName());

    @GetMapping("/post/{postId}")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCommentsByPost(@PathVariable Long postId) {
        logger.info("Fetching comments for post ID: " + postId);
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        logger.info("Found " + comments.size() + " comments");
        
        return comments.stream().map(comment -> {
            User user = userRepository.findById(comment.getUserId()).orElse(null);
            
            String displayName = "User #" + comment.getUserId();
            String companyName = "";
            boolean isSme = false;

            if (user != null) {
                if (user.getProfile() != null && user.getProfile().getDisplayName() != null) {
                    displayName = user.getProfile().getDisplayName();
                }
                isSme = user.getRoleId() != null && user.getRoleId() == 1L;
                if (isSme && user.getBusinessProfile() != null) {
                    companyName = user.getBusinessProfile().getCompanyName();
                }
            }

            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", comment.getId());
            map.put("author", displayName);
            map.put("avatar", user != null && user.getProfile() != null ? user.getProfile().getAvatarUrl() : null);
            map.put("company", companyName != null ? companyName : "");
            map.put("isSme", isSme);
            map.put("content", comment.getContent());
            map.put("date", comment.getCreatedAt() != null ? comment.getCreatedAt().toLocalDate().toString() : "Recent");
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> postComment(@RequestBody Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);
        return ResponseEntity.ok(saved);
    }
}

