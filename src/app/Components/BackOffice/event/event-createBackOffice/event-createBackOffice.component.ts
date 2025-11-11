import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService, EventPayload } from '../../../../Core/event.service';

@Component({
  selector: 'app-event-create-back-office',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: 'event-createBackOffice.component.html',
  styleUrls: ['event-createBackOffice.component.css']
})
export class EventCreateBackOfficeComponent {
  eventForm: FormGroup;
  submitted = false;
  serverError: string | null = null;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: ['', Validators.required],
      endDate: [''],
      published: [false],
      photo: [null]
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  onFileChange(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const fileList = inputEl.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    const file = fileList.item(0);
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.eventForm.patchValue({ photo: this.photoPreview });
    };
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.photoPreview = null;
    this.eventForm.patchValue({ photo: null });
  }

  private toApiDate(value: string): string {
    if (!value) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  }

  onSubmit() {
    this.submitted = true;
    this.serverError = null;

    if (this.eventForm.invalid) {
      return;
    }

    const vals = this.eventForm.value;
    const newEvent: EventPayload = {
      title: vals.title?.trim(),
      description: vals.description?.trim(),
      location: vals.location?.trim(),
      startDate: this.toApiDate(vals.startDate),
      endDate: this.toApiDate(vals.endDate || vals.startDate),
      published: vals.published ?? false,
      photo: vals.photo ?? null
    };
    
    this.eventService.createEvent(newEvent).subscribe({
      next: () => this.router.navigate(['/back-office/events/list']),
      error: err => {
        console.error('CreateEvent error response:', err);
        // If the backend returned { message: "...", timestamp: "..." }
        this.serverError = err.message || err.error?.message || 'Creation failed';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/back-office/events/list']);
  }
}
