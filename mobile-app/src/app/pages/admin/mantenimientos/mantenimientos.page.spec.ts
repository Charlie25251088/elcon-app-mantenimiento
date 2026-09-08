import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MantenimientosPage } from './mantenimientos.page';

describe('MantenimientosPage', () => {
  let component: MantenimientosPage;
  let fixture: ComponentFixture<MantenimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
