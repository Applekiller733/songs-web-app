package com.example.backend.repository;

import com.example.backend.model.Song;
import com.example.backend.model.AppUser;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public DataLoader(SongRepository songRepository, UserRepository userRepository) {
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0 && songRepository.count() == 0) {
            AppUser admin = new AppUser(null, "admin", "admin@gmail.com", "admin123", AppUser.Role.ADMIN, new ArrayList<>());
            AppUser appUser1 = new AppUser(null, "user1", "user1@gmail.com", "user123", AppUser.Role.USER, new ArrayList<>());
            userRepository.saveAll(List.of(admin, appUser1));

            List<Song> songs = new ArrayList<>();
            songs.add(new Song(null, "Island in the Sun", "Weezer", "Rock", "https://i.scdn.co/image/ab67616d0000b2731e0dc5baaabda304b0ad1815", 0, 0, appUser1));
            songs.add(new Song(null, "Passenger", "Deftones", "Metal", "https://i1.sndcdn.com/artworks-Mndt2nr2zGNU-0-t500x500.jpg", 0, 0, appUser1));
            songs.add(new Song(null, "Don't Fear the Reaper", "Blue Oyster Cult", "Rock", "https://upload.wikimedia.org/wikipedia/en/6/6b/DontFearTheReaper.jpg", 0, 0, admin));
            songs.add(new Song(null, "Bleed the Freak", "Alice in Chains", "Metal", "https://i.scdn.co/image/ab67616d0000b2731f829ea9c2c7ffcec1a3c857", 0, 0, appUser1));
            songs.add(new Song(null, "Man in the Box", "Alice in Chains", "Metal", "https://i.scdn.co/image/ab67616d0000b2731f829ea9c2c7ffcec1a3c857", 0, 0, admin));
            songs.add(new Song(null, "Everlong", "Foo Fighters", "Rock", "https://i.scdn.co/image/ab67616d0000b2730389027010b78a5e7dce426b", 0, 0, appUser1));
            songs.add(new Song(null, "Smells Like Teen Spirit", "Nirvana", "Rock", "https://example.com/image1.jpg", 0, 0, admin));
            songs.add(new Song(null, "Sweet Child O' Mine", "Guns N' Roses", "Rock", "https://example.com/image2.jpg", 0, 0, appUser1));
            songs.add(new Song(null, "Bohemian Rhapsody", "Queen", "Rock", "https://example.com/image3.jpg", 0, 0, admin));

            for (int i = 1; i <= 42; i++) {
                AppUser owner = i % 2 == 0 ? admin : appUser1;
                songs.add(new Song(null, "Song " + i, "Artist " + (i % 5), "Genre " + (i % 3), "https://example.com/image" + i + ".jpg", 0, 0, owner));
            }
            songRepository.saveAll(songs);

            System.out.println("🎵 50+ sample songs and users loaded into PostgreSQL database!");
        } else {
            System.out.println("📀 Data already exists in the database.");
        }
    }
}