import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerService } from '../../../../core/services/container.service';

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

  ngOnInit(): void {
    this.containerService.listContainers().subscribe({
      next: containers => {
        const running = containers.filter(c => (c.status ?? '').toLowerCase().includes('up')).length;
        this.totalContainers.set(containers.length);
        this.runningContainers.set(running);
        this.stoppedContainers.set(containers.length - running);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }
}
