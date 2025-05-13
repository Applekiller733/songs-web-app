package com.example.backend.service;

import com.example.backend.model.AppUser;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser createUser(AppUser appUser) {
        return userRepository.save(appUser);
    }

    public Optional<AppUser> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<AppUser> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<AppUser> findAll() {
        return userRepository.findAll();
    }

    public AppUser updateUser(Long id, AppUser updatedAppUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(updatedAppUser.getUsername());
                    user.setEmail(updatedAppUser.getEmail());
                    user.setPassword(updatedAppUser.getPassword());
                    user.setRole(updatedAppUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}