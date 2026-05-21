import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerService } from '../../../../core/services/container.service';
import { ContainerInfo } from '../../../../core/models/container.model';

@Component({
  selector: 'app-containers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './containers.html'
})
export class ContainersComponent implements OnInit {

  containers = signal<ContainerInfo[]>([]);
  loading = signal(true);
  actionInProgress = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  private containerService = inject(ContainerService);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.containerService.listContainers().subscribe({
      next: data => { this.containers.set(data); this.loading.set(false); },
      error: () => { this.errorMessage.set('No se pudo conectar con el daemon de Docker.'); this.loading.set(false); }
    });
  }

  stop(id: string): void {
    this.actionInProgress.set(id);
    this.containerService.stopContainer(id).subscribe({
      next: () => { this.actionInProgress.set(null); this.load(); },
      error: () => { this.actionInProgress.set(null); }
    });
  }

  remove(id: string): void {
    this.actionInProgress.set(id);
    this.containerService.removeContainer(id).subscribe({
      next: () => { this.actionInProgress.set(null); this.load(); },
      error: () => { this.actionInProgress.set(null); }
    });
  }

  isRunning(container: ContainerInfo): boolean {
    return (container.status ?? '').toLowerCase().includes('up');
  }

  getAccessUrl(container: ContainerInfo): string | null {
    if (!container.ports || container.ports.length === 0) return null;
    const publicPort = parseInt(container.ports[0].split(':')[0], 10);
    if (!publicPort) return null;
    const hostname = window.location.hostname;
    if (publicPort === 443) return `https://${hostname}`;
    if (publicPort === 80) return `http://${hostname}`;
    return `http://${hostname}:${publicPort}`;
  }
}
