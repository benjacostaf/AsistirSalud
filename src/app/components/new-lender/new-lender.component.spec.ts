import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLenderComponent } from './new-lender.component';

describe('NewLenderComponent', () => {
  let component: NewLenderComponent;
  let fixture: ComponentFixture<NewLenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
