package com.cloudrower.api.controller;

import com.cloudrower.api.dto.DeploymentDto;
import com.cloudrower.api.service.DockerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DockerService dockerService;

    public DeploymentController(DockerService dockerService) {
        this.dockerService = dockerService;
    }

    @GetMapping
    public ResponseEntity<?> listDeployments() {
        try {
            List<DeploymentDto> deployments = dockerService.listDeployments();
            return ResponseEntity.ok(deployments);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("message",
                    "No se pudo obtener el histórico: " + e.getMessage()));
        }
    }
}
