import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout';
import { HomeComponent } from './pages/home/home';
import { ContainersComponent } from './pages/containers/containers';
import { DeployComponent } from './pages/deploy/deploy';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'containers', component: ContainersComponent },
      { path: 'deploy', component: DeployComponent }
    ]
  }
];
