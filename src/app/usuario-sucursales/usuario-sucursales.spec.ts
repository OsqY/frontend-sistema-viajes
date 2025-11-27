import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioSucursales } from './usuario-sucursales';

describe('UsuarioSucursales', () => {
  let component: UsuarioSucursales;
  let fixture: ComponentFixture<UsuarioSucursales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioSucursales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioSucursales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
