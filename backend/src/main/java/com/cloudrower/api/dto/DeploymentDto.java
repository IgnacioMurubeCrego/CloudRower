package com.cloudrower.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DeploymentDto {

    private Long id;
    private String containerId;
    private String containerName;
    private String image;
    private List<String> ports;
    private LocalDateTime deployedAt;
    private String currentStatus;

    public DeploymentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContainerId() { return containerId; }
    public void setContainerId(String containerId) { this.containerId = containerId; }

    public String getContainerName() { return containerName; }
    public void setContainerName(String containerName) { this.containerName = containerName; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getPorts() { return ports; }
    public void setPorts(List<String> ports) { this.ports = ports; }

    public LocalDateTime getDeployedAt() { return deployedAt; }
    public void setDeployedAt(LocalDateTime deployedAt) { this.deployedAt = deployedAt; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
}
