import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioViajes } from './usuario-viajes';

describe('UsuarioViajes', () => {
  let component: UsuarioViajes;
  let fixture: ComponentFixture<UsuarioViajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioViajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioViajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
