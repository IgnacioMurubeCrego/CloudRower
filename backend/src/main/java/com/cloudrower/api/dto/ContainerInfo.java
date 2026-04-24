package com.cloudrower.api.dto;

import java.util.List;

public class ContainerInfo {

    private String id;
    private String name;
    private String image;
    private String status;
    private List<String> ports;
    private long created;

    public ContainerInfo() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getPorts() { return ports; }
    public void setPorts(List<String> ports) { this.ports = ports; }

    public long getCreated() { return created; }
    public void setCreated(long created) { this.created = created; }
}
