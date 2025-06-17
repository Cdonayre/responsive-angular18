import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListaUsuariosComponent } from './form-lista-usuarios.component';

describe('FormListaUsuariosComponent', () => {
  let component: FormListaUsuariosComponent;
  let fixture: ComponentFixture<FormListaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormListaUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormListaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
