package com.cloudrower.api.controller;

import com.cloudrower.api.dto.User;
import com.cloudrower.api.model.UserEntity;
import com.cloudrower.api.repository.UserRepository;
import com.cloudrower.api.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Credenciales incorrectas"));
        }

        UserEntity userEntity = userOpt.get();
        String token = jwtService.generateToken(email);

        User userDto = new User(userEntity.getId(), userEntity.getEmail(), userEntity.getName());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", userDto
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(409)
                    .body(Map.of("message", "El email ya está registrado"));
        }

        UserEntity newUser = new UserEntity(email, passwordEncoder.encode(password), name);
        userRepository.save(newUser);

        String token = jwtService.generateToken(email);
        User userDto = new User(newUser.getId(), newUser.getEmail(), newUser.getName());

        return ResponseEntity.status(201).body(Map.of(
                "token", token,
                "user", userDto
        ));
    }
}