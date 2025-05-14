import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-logon-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  template: `   
 <div class="d-flex vh-100">
  <!-- Sidebar à esquerda -->
  <app-sidebar></app-sidebar>

  <!-- Área principal (header + conteúdo) -->
  <div class="d-flex flex-column flex-grow-1">
    <!-- Header no topo da área de conteúdo -->
    <app-header></app-header>

    <!-- Conteúdo principal -->
    <div class="flex-grow-1 p-4 overflow-auto">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
`,
})
export class FullLayoutComponent { }
