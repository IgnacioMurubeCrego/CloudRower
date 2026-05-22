package com.cloudrower.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deployments")
public class DeploymentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "container_id", length = 64)
    private String containerId;

    @Column(name = "container_name")
    private String containerName;

    @Column(nullable = false)
    private String image;

    @Column(length = 500)
    private String ports;

    @Column(name = "deployed_at", nullable = false)
    private LocalDateTime deployedAt;

    public DeploymentRecord() {}

    public DeploymentRecord(String containerId, String containerName, String image,
                            String ports, LocalDateTime deployedAt) {
        this.containerId = containerId;
        this.containerName = containerName;
        this.image = image;
        this.ports = ports;
        this.deployedAt = deployedAt;
    }

    public Long getId() { return id; }

    public String getContainerId() { return containerId; }
    public void setContainerId(String containerId) { this.containerId = containerId; }

    public String getContainerName() { return containerName; }
    public void setContainerName(String containerName) { this.containerName = containerName; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getPorts() { return ports; }
    public void setPorts(String ports) { this.ports = ports; }

    public LocalDateTime getDeployedAt() { return deployedAt; }
    public void setDeployedAt(LocalDateTime deployedAt) { this.deployedAt = deployedAt; }
}
