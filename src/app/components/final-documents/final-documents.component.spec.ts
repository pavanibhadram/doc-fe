import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDocumentsComponent } from './final-documents.component';

describe('FinalDocumentsComponent', () => {
  let component: FinalDocumentsComponent;
  let fixture: ComponentFixture<FinalDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
