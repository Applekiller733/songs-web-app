package com.example.backend.controller;

import com.example.backend.model.Song;
import com.example.backend.repository.SongRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SongControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SongRepository songRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllSongs() throws Exception {
        mockMvc.perform(get("/songs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testAddSong() throws Exception {
        Song song = new Song(null, "Test Song", "Test Artist", "Rock", "image.jpg", 0, 0);
        String songJson = objectMapper.writeValueAsString(song);

        mockMvc.perform(post("/songs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(songJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Song"));
    }
}
