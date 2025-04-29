package com.example.backend.repository;

import com.example.backend.model.Song;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final SongRepository songRepository;

    public DataLoader(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (songRepository.count() == 0) {
            List<Song> songs = new ArrayList<>();
            songs.add(new Song(null, "Island in the Sun", "Weezer", "Rock", "https://i.scdn.co/image/ab67616d0000b2731e0dc5baaabda304b0ad1815", 0, 0));
            songs.add(new Song(null, "Passenger", "Deftones", "Metal", "https://i1.sndcdn.com/artworks-Mndt2nr2zGNU-0-t500x500.jpg", 0, 0));
            songs.add(new Song(null, "Don't Fear the Reaper", "Blue Oyster Cult", "Rock", "https://upload.wikimedia.org/wikipedia/en/6/6b/DontFearTheReaper.jpg", 0, 0));
            songs.add(new Song(null, "Bleed the Freak", "Alice in Chains", "Metal", "https://i.scdn.co/image/ab67616d0000b2731f829ea9c2c7ffcec1a3c857", 0, 0));
            songs.add(new Song(null, "Man in the Box", "Alice in Chains", "Metal", "https://i.scdn.co/image/ab67616d0000b2731f829ea9c2c7ffcec1a3c857", 0, 0));
            songs.add(new Song(null, "Everlong", "Foo Fighters", "Rock", "https://i.scdn.co/image/ab67616d0000b2730389027010b78a5e7dce426b", 0, 0));
            // Add more songs (e.g., 50 total)
            songs.add(new Song(null, "Smells Like Teen Spirit", "Nirvana", "Rock", "https://example.com/image1.jpg", 0, 0));
            songs.add(new Song(null, "Sweet Child O' Mine", "Guns N' Roses", "Rock", "https://example.com/image2.jpg", 0, 0));
            songs.add(new Song(null, "Bohemian Rhapsody", "Queen", "Rock", "https://example.com/image3.jpg", 0, 0));
            // Continue adding songs to reach 50+ entities
            for (int i = 1; i <= 42; i++) {
                songs.add(new Song(null, "Song " + i, "Artist " + (i % 5), "Genre " + (i % 3), "https://example.com/image" + i + ".jpg", 0, 0));
            }
            songRepository.saveAll(songs);
            System.out.println("🎵 50+ sample songs loaded into database!");
        } else {
            System.out.println("📀 Songs already exist in the database.");
        }
    }
}