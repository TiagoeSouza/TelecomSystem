import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private toastr: ToastrService) { }

    private showToast(
        type: 'success' | 'error' | 'warning' | 'info',
        msg: string,
        title: string,
        center: boolean
    ) {
        const originalPosition = this.toastr.toastrConfig.positionClass;

        if (center) {
            this.toastr.toastrConfig.positionClass = 'toast-center';
        }

        this.toastr[type](msg, title);

        if (center) {
            this.toastr.toastrConfig.positionClass = originalPosition;
        }
    }


    success(msg: string, title = 'Sucesso', center = false) {
        this.showToast('success', msg, title, center);
    }

    error(msg: string, title = 'Erro', center = false) {
        this.showToast('error', msg, title, center);
    }

    warning(msg: string, title = 'Atenção', center = false) {
        this.showToast('warning', msg, title, center);
    }

    info(msg: string, title = 'Informação', center = false) {
        this.showToast('info', msg, title, center);
    }
}
