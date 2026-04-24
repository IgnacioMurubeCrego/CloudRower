import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContainerInfo, ContainerRequest } from '../models/container.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContainerService {

  private readonly base = `${environment.apiUrl}/containers`;

  constructor(private http: HttpClient) {}

  listContainers(): Observable<ContainerInfo[]> {
    return this.http.get<ContainerInfo[]>(this.base);
  }

  deployContainer(request: ContainerRequest): Observable<ContainerInfo> {
    return this.http.post<ContainerInfo>(`${this.base}/deploy`, request);
  }

  stopContainer(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/stop`, {});
  }

  removeContainer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
