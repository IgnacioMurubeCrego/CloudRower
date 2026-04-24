package com.cloudrower.api.controller;

import com.cloudrower.api.dto.ContainerInfo;
import com.cloudrower.api.dto.ContainerRequest;
import com.cloudrower.api.service.DockerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/containers")
public class ContainerController {

    private final DockerService dockerService;

    public ContainerController(DockerService dockerService) {
        this.dockerService = dockerService;
    }

    @GetMapping
    public ResponseEntity<?> listContainers() {
        try {
            return ResponseEntity.ok(dockerService.listContainers());
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("message",
                    "No se pudo conectar con Docker: " + e.getMessage()));
        }
    }

    @PostMapping("/deploy")
    public ResponseEntity<?> deployContainer(@RequestBody ContainerRequest request) {
        try {
            ContainerInfo info = dockerService.deployContainer(request);
            return ResponseEntity.status(201).body(info);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/stop")
    public ResponseEntity<?> stopContainer(@PathVariable String id) {
        try {
            dockerService.stopContainer(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeContainer(@PathVariable String id) {
        try {
            dockerService.removeContainer(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}
