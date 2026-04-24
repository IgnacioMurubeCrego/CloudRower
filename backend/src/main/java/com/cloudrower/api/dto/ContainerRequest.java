package com.cloudrower.api.dto;

import java.util.List;
import java.util.Map;

public class ContainerRequest {

    private String image;
    private String containerName;
    private List<String> ports;
    private Map<String, String> envVars;

    public ContainerRequest() {}

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getContainerName() { return containerName; }
    public void setContainerName(String containerName) { this.containerName = containerName; }

    public List<String> getPorts() { return ports; }
    public void setPorts(List<String> ports) { this.ports = ports; }

    public Map<String, String> getEnvVars() { return envVars; }
    public void setEnvVars(Map<String, String> envVars) { this.envVars = envVars; }
}
