import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSchedule } from './card-schedule';

describe('CardSchedule', () => {
  let component: CardSchedule;
  let fixture: ComponentFixture<CardSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
