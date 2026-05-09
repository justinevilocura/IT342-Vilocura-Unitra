package edu.cit.vilocura.unitra.features.community;

import edu.cit.vilocura.unitra.features.community.Post;
import edu.cit.vilocura.unitra.features.auth.User;
import edu.cit.vilocura.unitra.features.community.PostRepository;
import edu.cit.vilocura.unitra.features.auth.UserRepository;
import edu.cit.vilocura.unitra.features.community.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream().map(post -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);

            String displayName = "User #" + post.getUserId();
            String companyName = null;

            if (user != null) {
                // Get Display Name from Profile
                if (user.getProfile() != null && user.getProfile().getDisplayName() != null) {
                    displayName = user.getProfile().getDisplayName();
                }

                // Get Company Name if SME
                if (user.getRoleId() != null && user.getRoleId() == 1L && user.getBusinessProfile() != null) {
                    companyName = user.getBusinessProfile().getCompanyName();
                }
            }

            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", post.getId());
            map.put("userId", post.getUserId());
            map.put("author", displayName);
            map.put("avatar", user != null && user.getProfile() != null ? user.getProfile().getAvatarUrl() : null);
            map.put("company", companyName != null ? companyName : "");
            map.put("isSme", user != null && user.getRoleId() != null && user.getRoleId() == 1L);
            map.put("content", post.getContent() != null ? post.getContent() : "");
            map.put("date", post.getCreatedAt() != null ? post.getCreatedAt().toLocalDate().toString() : "Recent");
            map.put("likes", post.getLikes() != null ? post.getLikes() : 0);
            map.put("comments", commentRepository.countByPostId(post.getId()));
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody Post updatedPost) {
        return postRepository.findById(id).map(post -> {
            post.setContent(updatedPost.getContent());
            post.setCompanyName(updatedPost.getCompanyName());
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);
            return ResponseEntity.ok("Post updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return ResponseEntity.ok("Post deleted");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        return postRepository.findById(id).map(post -> {
            post.setLikes((post.getLikes() != null ? post.getLikes() : 0) + 1);
            postRepository.save(post);
            return ResponseEntity.ok(post.getLikes());
        }).orElse(ResponseEntity.notFound().build());
    }
}

