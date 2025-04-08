package com.example.backend.service;

import com.example.backend.model.Song;
import com.example.backend.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class SongService {
    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public List<Song> getAllSongs(String genre, String artist, String name) {
        List<Song> songs = this.songRepository.findAll();

        if (genre != null && !genre.isEmpty()) {
            songs = songs.stream()
                    .filter(song -> song.getGenre().toLowerCase().contains(genre.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (artist != null && !artist.isEmpty()) {
            songs = songs.stream()
                    .filter(song -> song.getArtist().toLowerCase().contains(artist.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (name != null && !name.isEmpty()) {
            songs = songs.stream()
                    .filter(song -> song.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return orderByListens(songs);
    }

    public List<Song> orderByListens(List<Song> initList){
        initList.sort(Comparator.comparingInt(Song::getListens).reversed());
        return initList;
    }

    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }

    public Song addSong(Song song) {
        return songRepository.save(song);
    }

    public Song updateSong(Long id, Song updatedSong) {
        return songRepository.findById(id).map(song -> {
            song.setName(updatedSong.getName());
            song.setArtist(updatedSong.getArtist());
            song.setGenre(updatedSong.getGenre());
            song.setImage(updatedSong.getImage());
            return songRepository.save(song);
        }).orElseThrow(() -> new RuntimeException("Song not found"));
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }

    public Song incrementLikes(Long id) {
        return songRepository.findById(id).map(song -> {
            song.setLikes(song.getLikes() + 1);
            return songRepository.save(song);
        }).orElseThrow(() -> new RuntimeException("Song not found"));
    }

    public Song incrementListens(Long id) {
        return songRepository.findById(id).map(song -> {
            song.setListens(song.getListens() + 1);
            return songRepository.save(song);
        }).orElseThrow(() -> new RuntimeException("Song not found"));
    }
}