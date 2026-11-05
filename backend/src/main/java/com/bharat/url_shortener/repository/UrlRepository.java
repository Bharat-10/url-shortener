package com.bharat.url_shortener.repository;

import com.bharat.url_shortener.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
     Optional<Url> findByShortCode(String shortCode);
     List<Url> findByUserIdOrderByCreatedAtDesc(Long userId);

     Optional<Url> findByIdAndUserId(Long id, Long userId);
}
