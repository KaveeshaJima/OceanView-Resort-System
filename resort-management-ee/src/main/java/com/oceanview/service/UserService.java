package com.oceanview.service;

import com.oceanview.dto.*;
import com.oceanview.entity.User;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.repository.UserRepository;
import com.oceanview.utils.PasswordUtil; // මේක අමතක කරන්න එපා

import jakarta.ejb.Stateless;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class UserService {

    private UserRepository userRepository = new UserRepository();

    public UserResponseDTO createUser(UserRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        // Password එක HASH කරමු
        String hashedPw = PasswordUtil.hashPassword(request.getPassword());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(hashedPw) // Hash කරපු password එක දාමු
                .role(request.getRole())
                .build();

        return mapToDTO(userRepository.save(user));
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(int id) {
        User user = userRepository.findById(id);
        if (user == null) throw new ResourceNotFoundException("User not found: " + id);
        return mapToDTO(user);
    }

    public UserResponseDTO updateUser(int id, UserRequestDTO request) {
        User user = userRepository.findById(id);
        if (user == null) throw new ResourceNotFoundException("User not found: " + id);

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        // Password එක update කරනවා නම් ඒකත් Hash කරන්න ඕනේ
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(PasswordUtil.hashPassword(request.getPassword()));
        }

        return mapToDTO(userRepository.save(user));
    }

    public void deleteUser(int id) {
        if (userRepository.findById(id) == null)
            throw new ResourceNotFoundException("User not found: " + id);
        userRepository.delete(id);
    }

    private UserResponseDTO mapToDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}