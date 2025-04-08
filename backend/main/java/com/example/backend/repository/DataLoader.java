package com.example.backend.repository;

import com.example.backend.model.Song;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final SongRepository songRepository;

    public DataLoader(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (songRepository.count() == 0) { // Only load if empty
            List<Song> songs = List.of(
                    new Song(null, "Island in the Sun", "Weezer", "Rock", "https://i.scdn.co/image/ab67616d0000b2731e0dc5baaabda304b0ad1815", 0, 0),
                    new Song(null, "Passenger", "Deftones", "Metal", "https://i1.sndcdn.com/artworks-Mndt2nr2zGNU-0-t500x500.jpg", 0, 0),
                    new Song(null, "Don't Fear the Reaper", "Blue Oyster Cult","Rock",  "https://upload.wikimedia.org/wikipedia/en/6/6b/DontFearTheReaper.jpg", 0, 0),
                    new Song(null,  "Bleed the Freak", "Alice in Chains","Metal", "https://i.scdn.co/image/ab67616d0000b2731f829ea9c2c7ffcec1a3c857", 0, 0),
                    new Song(null, "Man in the Box", "Alice in Chains", "Metal", "https://i.scdn.co/image/ab67616d0000b2731f829ea9c2c7ffcec1a3c857", 0, 0),
                    new Song(null, "Everlong", "Foo Fighters", "Rock", "https://i.scdn.co/image/ab67616d0000b2730389027010b78a5e7dce426b", 0, 0)
            );
            songRepository.saveAll(songs);
            System.out.println("🎵 Sample songs loaded into database!");
        } else {
            System.out.println("📀 Songs already exist in the database.");
        }
    }
}
