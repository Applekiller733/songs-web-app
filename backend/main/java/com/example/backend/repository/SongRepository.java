package com.example.backend.repository;

import com.example.backend.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByGenreContainingIgnoreCase(String genre);
    List<Song> findByArtistContainingIgnoreCase(String artist);
    List<Song> findByNameContainingIgnoreCase(String name);
}