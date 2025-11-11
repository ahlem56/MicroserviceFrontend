// src/app/BackOffice/event-detailBackOffice.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, EventPayload } from 'src/app/Core/event.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detailBackOffice.component.html',
  styleUrls: ['./event-detailBackOffice.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe]
})
export class EventDetailBackOfficeComponent implements OnInit {
  eventForm: FormGroup;
  eventId!: number;
  loading = true;
  submitting = false;
  submitted = false;
  error: string | null = null;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    protected router: Router,
    private eventService: EventService,
    private datePipe: DatePipe
  ) {
    this.eventForm = this.fb.group({
      title:            ['', [Validators.required, Validators.maxLength(200)]],
      description:      ['', [Validators.required, Validators.maxLength(500)]],
      location:         ['', [Validators.required, Validators.maxLength(100)]],
      startDate:        ['', [Validators.required]],
      endDate:          [''],
      published:        [false],
      photo:            [null]
    });
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails();
  }

  private loadEventDetails(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: event => {
        const startDate = this.datePipe.transform(event.startDate, 'yyyy-MM-ddTHH:mm');
        const endDate = event.endDate ? this.datePipe.transform(event.endDate, 'yyyy-MM-ddTHH:mm') : '';
        this.eventForm.patchValue({
          title:            event.title,
          description:      event.description,
          location:         event.location,
          startDate:        startDate || '',
          endDate:          endDate || '',
          published:        event.published ?? false,
          photo:            event.photo ?? null
        });
        this.photoPreview = event.photo ?? null;
        this.loading = false;
      },
      error: err => {
        this.error = err?.message || 'Échec du chargement';
        this.loading = false;
      }
    });
  }

  get f() {
    return this.eventForm.controls as { [key: string]: any };
  }

  private toApiDate(value: string): string {
    if (!value) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  }

  onFileChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
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

  onSubmit(): void {
    this.submitted = true;
    if (this.eventForm.invalid) return;
    this.submitting = true;
    this.error = null;

    const vals = this.eventForm.value;
    const updatedEvent: EventPayload = {
      title:             vals.title?.trim(),
      description:       vals.description?.trim(),
      location:          vals.location?.trim(),
      startDate:         this.toApiDate(vals.startDate),
      endDate:           this.toApiDate(vals.endDate || vals.startDate),
      published:         vals.published ?? false,
      photo:             vals.photo ?? null
    };

    this.eventService.updateEvent(this.eventId, updatedEvent)
      .pipe(
        catchError(err => {
          this.error = err?.message || 'Échec de la mise à jour';
          return of(null);
        }),
        finalize(() => this.submitting = false)
      )
      .subscribe(() => {
        if (!this.error) {
          this.router.navigate(['/back-office/events/list']);
        }
      });
  }
}
