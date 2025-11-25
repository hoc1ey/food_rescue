import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewDonation } from './modal-new-donation';

describe('ModalNewDonation', () => {
  let component: ModalNewDonation;
  let fixture: ComponentFixture<ModalNewDonation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewDonation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewDonation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
