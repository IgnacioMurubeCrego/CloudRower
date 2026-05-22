package com.cloudrower.api.repository;

import com.cloudrower.api.model.DeploymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeploymentRepository extends JpaRepository<DeploymentRecord, Long> {

    List<DeploymentRecord> findAllByOrderByDeployedAtDesc();
}
