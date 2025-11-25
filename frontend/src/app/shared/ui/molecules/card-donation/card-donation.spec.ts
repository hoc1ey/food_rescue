import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDonationComponent, type Donation } from './card-donation';
import { LucideIconsModule } from '../../../lucide-icons.module';

describe('CardDonationComponent', () => {
    let component: CardDonationComponent;
    let fixture: ComponentFixture<CardDonationComponent>;

    const mockDonation: Donation = {
        id: '1',
        productName: 'Sándwiches de pollo',
        quantity: 15,
        unit: 'unidades',
        status: 'AVAILABLE',
        location: {
            name: 'KFC Calle Mayor',
            address: 'Calle Mayor 45, Madrid'
        },
        pickupTime: '18:00'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardDonationComponent, LucideIconsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CardDonationComponent);
        component = fixture.componentInstance;
        component.donation = mockDonation;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display donation information correctly', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const title = compiled.querySelector('.donation-title');

        expect(title?.textContent).toContain('15');
        expect(title?.textContent).toContain('Sándwiches de pollo');
    });

    it('should display correct status label', () => {
        expect(component.getStatusLabel('AVAILABLE')).toBe('Disponible');
        expect(component.getStatusLabel('ASSIGNED')).toBe('Asignado');
        expect(component.getStatusLabel('DELIVERED')).toBe('Entregado');
    });

    it('should return correct status class', () => {
        expect(component.getStatusClass('AVAILABLE')).toBe('status-available');
        expect(component.getStatusClass('ASSIGNED')).toBe('status-assigned');
        expect(component.getStatusClass('DELIVERED')).toBe('status-delivered');
    });

    it('should display location name', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const locationText = compiled.querySelector('.info-text');

        expect(locationText?.textContent).toContain('KFC Calle Mayor');
    });

    it('should display pickup time', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const bodyText = compiled.textContent;

        expect(bodyText).toContain('18:00');
    });

    it('should apply theme class correctly', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const card = compiled.querySelector('.donation-card');

        expect(card?.classList.contains('theme-donor')).toBeTruthy();
    });

    it('should change theme when theme input changes', () => {
        component.theme = 'beneficiary';
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const card = compiled.querySelector('.donation-card');

        expect(card?.classList.contains('theme-beneficiary')).toBeTruthy();
    });

    it('should display correct status badge for AVAILABLE status', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const statusBadge = compiled.querySelector('.status-badge');

        expect(statusBadge?.textContent?.trim()).toBe('Disponible');
        expect(statusBadge?.classList.contains('status-available')).toBeTruthy();
    });

    it('should display address in footer', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const footerText = compiled.querySelector('.footer-text');

        expect(footerText?.textContent).toContain('Calle Mayor 45, Madrid');
    });
});
