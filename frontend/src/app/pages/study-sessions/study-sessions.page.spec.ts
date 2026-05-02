import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudySessionsPage } from './study-sessions.page';

describe('StudySessionsPage', () => {
  let component: StudySessionsPage;
  let fixture: ComponentFixture<StudySessionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudySessionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
