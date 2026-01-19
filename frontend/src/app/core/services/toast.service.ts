import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastType } from '../../shared/ui/atoms/toast/toast';

export interface ToastData {
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<ToastData>();
    toast$ = this.toastSubject.asObservable();

    show(data: ToastData): void {
        this.toastSubject.next(data);
    }

    success(message: string, title?: string, duration?: number): void {
        this.show({ type: 'success', message, title, duration });
    }

    info(message: string, title?: string, duration?: number): void {
        this.show({ type: 'info', message, title, duration });
    }

    warning(message: string, title?: string, duration?: number): void {
        this.show({ type: 'warning', message, title, duration });
    }

    error(message: string, title?: string, duration?: number): void {
        this.show({ type: 'error', message, title, duration });
    }
}
