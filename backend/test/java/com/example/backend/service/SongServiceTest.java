package com.example.backend.service;

import com.example.backend.model.Song;
import com.example.backend.repository.SongRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class SongServiceTest {

    private SongRepository songRepository;
    private SongService songService;

    @BeforeEach
    void setUp() {
        songRepository = mock(SongRepository.class);
        songService = new SongService(songRepository);
    }

    @Test
    void testGetAllSongs() {
        List<Song> mockSongs = Arrays.asList(
                new Song(1L, "Song 1", "Artist 1", "Rock", "image1.jpg", 0, 0),
                new Song(2L, "Song 2", "Artist 2", "Pop", "image2.jpg", 0, 0)
        );

        when(songRepository.findAll()).thenReturn(mockSongs);

        List<Song> result = songService.getAllSongs(null, null, null);
        assertEquals(2, result.size());
        assertEquals("Song 1", result.get(0).getName());
    }

    @Test
    void testGetSongById() {
        Song song = new Song(1L, "Song 1", "Artist 1", "Rock", "image1.jpg", 0, 0);
        when(songRepository.findById(1L)).thenReturn(Optional.of(song));

        Optional<Song> foundSong = songService.getSongById(1L);
        assertTrue(foundSong.isPresent());
        assertEquals("Song 1", foundSong.get().getName());
    }

    @Test
    void testAddSong() {
        Song newSong = new Song(null, "New Song", "New Artist", "Pop", "image.jpg", 0, 0);
        Song savedSong = new Song(1L, "New Song", "New Artist", "Pop", "image.jpg", 0, 0);
        when(songRepository.save(any(Song.class))).thenReturn(savedSong);

        Song result = songService.addSong(newSong);
        assertNotNull(result.getId());
        assertEquals("New Song", result.getName());
    }

    @Test
    void testOrderByListens() {
        Song song1 = new Song(1L, "Song A", "Artist 1", "Rock", "url1", 5, 10);
        Song song2 = new Song(2L, "Song B", "Artist 2", "Pop", "url2", 20, 5);
        Song song3 = new Song(3L, "Song C", "Artist 3", "Jazz", "url3", 10, 8);

        List<Song> songs = Arrays.asList(song1, song2, song3);

        List<Song> sortedSongs = songService.orderByListens(songs);

        assertEquals(song2, sortedSongs.get(0));
        assertEquals(song3, sortedSongs.get(1));
        assertEquals(song1, sortedSongs.get(2));
    }
}
