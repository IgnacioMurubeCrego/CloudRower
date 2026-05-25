import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerService } from '../../../../core/services/container.service';
import { AuthService } from '../../../../core/services/auth.service';

const SYSTEM_PREFIX = 'cloudrower-';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {

  totalContainers = signal(0);
  runningContainers = signal(0);
  stoppedContainers = signal(0);
  loading = signal(true);

  private containerService = inject(ContainerService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.containerService.listContainers().subscribe({
      next: containers => {
        const visible = this.authService.isAdmin()
          ? containers
          : containers.filter(c => !c.name.startsWith(SYSTEM_PREFIX));
        const running = visible.filter(c => (c.status ?? '').toLowerCase().includes('up')).length;
        this.totalContainers.set(visible.length);
        this.runningContainers.set(running);
        this.stoppedContainers.set(visible.length - running);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }
}
