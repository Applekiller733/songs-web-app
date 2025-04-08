package com.example.backend.controller;

import com.example.backend.model.Song;
import com.example.backend.service.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs")
@CrossOrigin(origins = "http://localhost:3000")
public class SongController {
    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public List<Song> getAllSongs(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String artist,
            @RequestParam(required = false) String name) {
        return songService.getAllSongs(genre, artist, name);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        return songService.getSongById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Song addSong(@RequestBody Song song) {
        return songService.addSong(song);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Long id, @RequestBody Song song) {
        try {
            return ResponseEntity.ok(songService.updateSong(id, song));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/like")
    public ResponseEntity<Song> incrementLikes(@PathVariable Long id) {
        return ResponseEntity.ok(songService.incrementLikes(id));
    }

    @PatchMapping("/{id}/listen")
    public ResponseEntity<Song> incrementListens(@PathVariable Long id) {
        return ResponseEntity.ok(songService.incrementListens(id));
    }
}

