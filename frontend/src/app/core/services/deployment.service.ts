import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeploymentRecord } from '../models/deployment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeploymentService {

  private readonly base = `${environment.apiUrl}/deployments`;

  constructor(private http: HttpClient) {}

  listDeployments(): Observable<DeploymentRecord[]> {
    return this.http.get<DeploymentRecord[]>(this.base);
  }
}
