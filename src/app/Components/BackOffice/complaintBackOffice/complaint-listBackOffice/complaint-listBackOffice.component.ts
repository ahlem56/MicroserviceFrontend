import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ComplaintService } from 'src/app/Core/complaint.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-complaint-list-backoffice',
  templateUrl: './complaint-listBackOffice.component.html',
  styleUrls: ['./complaint-listBackOffice.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ComplaintListBackOfficeComponent implements OnInit {
  complaints: any[] = []; // Toutes les réclamations
  filteredComplaints: any[] = []; // Réclamations filtrées
  isLoading: boolean = false; // État de chargement
  complaintStatuses: string[] = ['ignored', 'pending', 'resolved']; // Statuts possibles
  filterType: string = 'all'; // Filtre actuel

  constructor(private complaintService: ComplaintService, private router: Router) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  // Charger les réclamations depuis l'API
  loadComplaints(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.isLoading = true;
    this.complaintService.getAllComplaints(headers).subscribe({
      next: (response) => {
        const resp: any = response as any;
        // Normalize paginated or wrapped responses
        const maybeList = Array.isArray(resp)
          ? resp
          : (resp?.content ?? resp?.data ?? resp?.items ?? resp?.reclamations ?? resp?.reclamationList ?? []);
        const list = (maybeList || []).filter((raw: any) => !!raw && (
          raw.reportId !== undefined ||
          raw.id !== undefined ||
          raw.userId !== undefined ||
          raw.issueDescription !== undefined ||
          raw.description !== undefined ||
          raw.complaintDescription !== undefined
        ));

        // Dev: inspect unexpected shapes
        console.log('Complaints raw response:', resp);

        this.complaints = (list || []).map((raw: any, idx: number) => {
          console.log('Complaint raw item', idx, raw);
          const complaintId =
            raw?.complaintId ?? raw?.id ?? raw?.reportId ?? raw?.report_id ?? undefined;
          const description =
            raw?.complaintDescription ??
            raw?.description ??
            raw?.issueDescription ??
            raw?.issue_description ??
            'N/A';
          const severity = (raw?.severity ?? raw?.level ?? '').toString();
          const status = (raw?.complaintStatus ?? raw?.status ?? 'unknown').toString().toLowerCase();
          const simpleUser = raw?.simpleUser ?? raw?.user ?? undefined;
          const userId = raw?.userId ?? raw?.simpleUserId ?? raw?.user_id ?? undefined;
          const rawDate = raw?.createdDate ?? raw?.created_date ?? raw?.created_at ?? undefined;
          let displayCreatedDate: string | undefined;
          if (Array.isArray(rawDate) && rawDate.length >= 3) {
            const [y, m, d] = rawDate;
            const mm = String(m).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            displayCreatedDate = `${y}-${mm}-${dd}`;
          } else if (typeof rawDate === 'string' && rawDate.trim().length > 0) {
            displayCreatedDate = rawDate;
          } else if (rawDate && typeof rawDate === 'object') {
            const y =
              rawDate.year ?? rawDate.Year ?? rawDate.Y ?? rawDate?.['$year'] ?? undefined;
            const m =
              rawDate.monthValue ?? rawDate.month ?? rawDate.Month ?? rawDate?.['$month'] ?? undefined;
            const d2 =
              rawDate.dayOfMonth ?? rawDate.day ?? rawDate.Day ?? rawDate?.['$day'] ?? undefined;
            if (y !== undefined && m !== undefined && d2 !== undefined) {
              const mm = String(m).padStart(2, '0');
              const dd = String(d2).padStart(2, '0');
              displayCreatedDate = `${y}-${mm}-${dd}`;
            }
          } else if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
            const y = rawDate.getFullYear();
            const m = String(rawDate.getMonth() + 1).padStart(2, '0');
            const d2 = String(rawDate.getDate()).padStart(2, '0');
            displayCreatedDate = `${y}-${m}-${d2}`;
          }

          const normalized = {
            complaintId,
            complaintDescription: description,
            severity,
            complaintStatus: status,
            simpleUser,
            userId,
            createdDate: rawDate,
            displayCreatedDate
          };
          console.log('Complaint normalized item', idx, normalized);
          return normalized;
        });
        this.applyFilter(this.filterType); // Appliquer le filtre initial

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations :', error);
        this.isLoading = false;
        alert('Erreur lors du chargement des réclamations.');
      },
    });
  }

  // Appliquer un filtre en fonction du statut
  applyFilter(status: string): void {
    this.filterType = status;
    if (status === 'all') {
      this.filteredComplaints = [...this.complaints]; // Afficher toutes les réclamations
    } else {
      this.filteredComplaints = this.complaints.filter((complaint) => {
        const normalized =
          (complaint.complaintStatus || complaint.status || 'unknown')
            .toString()
            .toLowerCase();
        return normalized === status.toLowerCase();
      });
    }
  }

  // Rediriger vers les détails de la réclamation
  viewDetails(complaintId: number): void {
    this.router.navigate(['back-office/complaints', complaintId]);
  }

  // Note: user lookup by complaint is not supported in Reclamation MS; skipping here.


// Calculate number of dots based on severity
getSeverityDots(severity: string): number {
  switch (severity?.toLowerCase()) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    default:
      return 0; // No dots for 'unknown' or null
  }
}

// Determine dot color based on severity
getSeverityColor(severity: string): string {
  return severity?.toLowerCase() === 'high' ? 'red' : 'orange';
}

// Update complaint (admin/backoffice quick edit: only description)
onEditComplaint(row: any): void {
  const newDesc = prompt('Update description:', row?.complaintDescription || row?.issueDescription || '');
  if (newDesc === null) {
    return;
  }
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const id = row?.complaintId ?? row?.reportId ?? row?.id;
  if (!id) {
    alert('Invalid complaint id.');
    return;
  }
  // Build DTO aligned with backend
  const payload = {
    userId: row?.userId ?? row?.simpleUser?.userId ?? null,
    issueDescription: newDesc,
    createdDate: row?.createdDate ?? row?.created_at ?? row?.created_date ?? null
  };
  this.complaintService.updateComplaint(id, 0, payload, headers).subscribe({
    next: () => {
      // reflect in UI
      row.complaintDescription = newDesc;
      row.issueDescription = newDesc;
      alert('Updated successfully.');
    },
    error: (err) => {
      console.error('Update failed', err);
      alert('Update failed.');
    }
  });
}

// Delete complaint
onDeleteComplaint(row: any): void {
  if (!confirm('Are you sure you want to delete this complaint?')) {
    return;
  }
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const id = row?.complaintId ?? row?.reportId ?? row?.id;
  if (!id) {
    alert('Invalid complaint id.');
    return;
  }
  this.complaintService.deleteComplaint(id, 0, headers).subscribe({
    next: () => {
      this.complaints = this.complaints.filter(c =>
        (c?.complaintId ?? c?.reportId ?? c?.id) !== id
      );
      this.applyFilter(this.filterType);
      alert('Deleted successfully.');
    },
    error: (err) => {
      console.error('Delete failed', err);
      alert('Delete failed.');
    }
  });
}

}