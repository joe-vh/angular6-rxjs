import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptosComponent } from './cryptos.component';

describe('CryptosComponent', () => {
  let component: CryptosComponent;
  let fixture: ComponentFixture<CryptosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
