import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTransportistas } from './reporte-transportistas';

describe('ReporteTransportistas', () => {
  let component: ReporteTransportistas;
  let fixture: ComponentFixture<ReporteTransportistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteTransportistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteTransportistas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
