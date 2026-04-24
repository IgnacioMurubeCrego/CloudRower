import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContainerService } from '../../../../core/services/container.service';
import { DOCKER_IMAGE_CATALOG, IMAGE_CATEGORIES } from '../../../../core/data/docker-images';
import { DockerImage } from '../../../../core/models/container.model';

@Component({
  selector: 'app-deploy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deploy.html'
})
export class DeployComponent implements OnInit {

  form!: FormGroup;
  catalog = DOCKER_IMAGE_CATALOG;
  categories = IMAGE_CATEGORIES;
  selectedCategory = signal('Todos');
  deploying = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private containerService = inject(ContainerService);
  private router = inject(Router);

  filteredCatalog = computed<DockerImage[]>(() => {
    const cat = this.selectedCategory();
    if (cat === 'Todos') return this.catalog;
    return this.catalog.filter(i => i.category === cat);
  });

  ngOnInit(): void {
    this.form = this.fb.group({
      image: ['', Validators.required],
      containerName: [''],
      ports: this.fb.array([]),
      envVars: this.fb.array([])
    });
  }

  get ports(): FormArray {
    return this.form.get('ports') as FormArray;
  }

  get envVars(): FormArray {
    return this.form.get('envVars') as FormArray;
  }

  selectImage(image: DockerImage): void {
    this.form.patchValue({ image: `${image.name}:${image.tag}` });
    this.ports.clear();
    (image.defaultPorts ?? []).forEach(p => this.ports.push(this.fb.control(p)));
  }

  addPort(): void {
    this.ports.push(this.fb.control(''));
  }

  removePort(i: number): void {
    this.ports.removeAt(i);
  }

  addEnvVar(): void {
    this.envVars.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeEnvVar(i: number): void {
    this.envVars.removeAt(i);
  }

  deploy(): void {
    if (this.form.invalid) return;
    this.deploying.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const envVarsObj: Record<string, string> = {};
    this.envVars.controls.forEach(ctrl => {
      const k = ctrl.get('key')?.value?.trim();
      const v = ctrl.get('value')?.value ?? '';
      if (k) envVarsObj[k] = v;
    });

    const ports: string[] = this.ports.controls
      .map(c => (c.value as string).trim())
      .filter(p => p.length > 0);

    this.containerService.deployContainer({
      image: this.form.value.image,
      containerName: this.form.value.containerName || undefined,
      ports,
      envVars: Object.keys(envVarsObj).length > 0 ? envVarsObj : undefined
    }).subscribe({
      next: container => {
        this.deploying.set(false);
        this.successMessage.set(`Contenedor "${container.name || container.id}" desplegado correctamente.`);
        this.form.reset();
        this.ports.clear();
        this.envVars.clear();
      },
      error: err => {
        this.deploying.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Error al desplegar el contenedor.');
      }
    });
  }

  goToContainers(): void {
    this.router.navigate(['/dashboard/containers']);
  }
}
