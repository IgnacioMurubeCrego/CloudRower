import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DeploymentService } from '../../../../core/services/deployment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DeploymentRecord } from '../../../../core/models/deployment.model';

const SYSTEM_PREFIX = 'cloudrower-';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './history.html'
})
export class HistoryComponent implements OnInit {

  deployments = signal<DeploymentRecord[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  private deploymentService = inject(DeploymentService);
  private authService = inject(AuthService);

  visibleDeployments = computed(() => {
    if (this.authService.isAdmin()) return this.deployments();
    return this.deployments().filter(d => !d.containerName?.startsWith(SYSTEM_PREFIX));
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.deploymentService.listDeployments().subscribe({
      next: data => { this.deployments.set(data); this.loading.set(false); },
      error: () => { this.errorMessage.set('No se pudo cargar el histórico de despliegues.'); this.loading.set(false); }
    });
  }

  statusClass(status: string | null): string {
    if (!status) return 'bg-gray-100 text-gray-400';
    const s = status.toLowerCase();
    if (s.startsWith('up')) return 'bg-green-50 text-green-700';
    if (s.startsWith('exited')) return 'bg-red-50 text-red-600';
    return 'bg-yellow-50 text-yellow-700';
  }

  statusDot(status: string | null): string {
    if (!status) return 'bg-gray-300';
    const s = status.toLowerCase();
    if (s.startsWith('up')) return 'bg-green-500';
    if (s.startsWith('exited')) return 'bg-red-400';
    return 'bg-yellow-400';
  }

  statusLabel(status: string | null): string {
    if (!status) return 'Eliminado';
    return status;
  }
}
