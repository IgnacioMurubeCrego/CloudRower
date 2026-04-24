package com.cloudrower.api.service;

import com.cloudrower.api.dto.ContainerInfo;
import com.cloudrower.api.dto.ContainerRequest;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.zerodep.ZerodepDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DockerService {

    private final DockerClient dockerClient;

    public DockerService(@Value("${docker.host:tcp://localhost:2375}") String dockerHost) {
        DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(dockerHost)
                .build();

        DockerHttpClient httpClient = new ZerodepDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .sslConfig(config.getSSLConfig())
                .build();

        this.dockerClient = DockerClientImpl.getInstance(config, httpClient);
    }

    public ContainerInfo deployContainer(ContainerRequest request) {
        pullImage(request.getImage());

        List<ExposedPort> exposedPortList = new ArrayList<>();
        Ports portBindings = new Ports();

        if (request.getPorts() != null) {
            for (String mapping : request.getPorts()) {
                String[] parts = mapping.split(":");
                if (parts.length == 2) {
                    int hostPort = Integer.parseInt(parts[0].trim());
                    int containerPort = Integer.parseInt(parts[1].trim());
                    ExposedPort ep = ExposedPort.tcp(containerPort);
                    exposedPortList.add(ep);
                    portBindings.bind(ep, Ports.Binding.bindPort(hostPort));
                }
            }
        }

        List<String> env = new ArrayList<>();
        if (request.getEnvVars() != null) {
            request.getEnvVars().forEach((k, v) -> env.add(k + "=" + v));
        }

        CreateContainerCmd cmd = dockerClient.createContainerCmd(request.getImage())
                .withExposedPorts(exposedPortList)
                .withHostConfig(HostConfig.newHostConfig().withPortBindings(portBindings))
                .withEnv(env);

        if (request.getContainerName() != null && !request.getContainerName().isBlank()) {
            cmd = cmd.withName(request.getContainerName());
        }

        CreateContainerResponse container = cmd.exec();
        dockerClient.startContainerCmd(container.getId()).exec();

        return inspectToInfo(container.getId());
    }

    public List<ContainerInfo> listContainers() {
        return dockerClient.listContainersCmd()
                .withShowAll(true)
                .exec()
                .stream()
                .map(c -> {
                    ContainerInfo info = new ContainerInfo();
                    info.setId(c.getId().substring(0, 12));
                    info.setName(c.getNames() != null && c.getNames().length > 0
                            ? c.getNames()[0].replaceFirst("^/", "")
                            : "");
                    info.setImage(c.getImage());
                    info.setStatus(c.getStatus());
                    info.setCreated(c.getCreated());
                    info.setPorts(c.getPorts() == null ? Collections.emptyList() :
                            Arrays.stream(c.getPorts())
                            .filter(p -> p.getPublicPort() != null)
                            .map(p -> p.getPublicPort() + ":" + p.getPrivatePort())
                            .collect(Collectors.toList()));
                    return info;
                })
                .collect(Collectors.toList());
    }

    public void stopContainer(String containerId) {
        dockerClient.stopContainerCmd(containerId).exec();
    }

    public void removeContainer(String containerId) {
        dockerClient.removeContainerCmd(containerId).withForce(true).exec();
    }

    private void pullImage(String image) {
        try {
            dockerClient.pullImageCmd(image).start().awaitCompletion();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Pull de imagen interrumpido", e);
        } catch (Exception e) {
            throw new RuntimeException("Error al descargar la imagen '" + image + "': " + e.getMessage(), e);
        }
    }

    private ContainerInfo inspectToInfo(String containerId) {
        var inspect = dockerClient.inspectContainerCmd(containerId).exec();
        ContainerInfo info = new ContainerInfo();
        info.setId(containerId.substring(0, 12));
        info.setName(inspect.getName().replaceFirst("^/", ""));
        info.setImage(inspect.getConfig().getImage());
        info.setStatus(inspect.getState().getStatus());
        info.setPorts(Collections.emptyList());
        info.setCreated(0L);
        return info;
    }
}
