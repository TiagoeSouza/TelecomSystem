import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})

export class HeaderComponent {
    constructor(private router: Router) { }
    user: string | null = localStorage.getItem('userName');
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        this.user = null;
        this.router.navigateByUrl('/login');
    }
}
