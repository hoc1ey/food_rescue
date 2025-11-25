import { TestBed } from '@angular/core/testing';
import { DonationsService } from './donations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DonationsService', () => {
    let service: DonationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(DonationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
