import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommissionService, Commission, CommissionSummary, User } from '../../../Core/commission.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface JwtPayload {
  sub: string;
  role: string;
  userId?: number;
  partnerId?: number;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-commission',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css'],
  providers: [CommissionService]
})
export class PartnerCommissionComponent implements OnInit {
  commissions: Commission[] = [];
  summary: CommissionSummary = {
    total: 0,
    pending: 0,
    paid: 0
  };
  displayedColumns: string[] = ['commissionId', 'amount', 'status', 'description', 'calculatedAt'];
  isLoading = true;
  error: string | null = null;
  canViewCommissions = false;
  partnerId: number | null = null;
  userId: number | null = null;

  constructor(
    private commissionService: CommissionService,
    private http: HttpClient
  ) {}

  private decodeToken(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT');
    }
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      console.log('Decoded role:', decoded.role);

      if (decoded.role === 'USER') {
        this.commissionService.getUserDetails().subscribe({
          next: (user: any) => {
            console.log('Fetched user:', user);
            this.partnerId = user.partner?.partnerId || null;
            console.log('Partner ID:', this.partnerId);
            this.canViewCommissions = true;
            if (this.partnerId) {
              this.loadData();
            } else {
              this.isLoading = false;
              this.error = 'You are not associated with any partner';
            }
          },
          error: (error: any) => {
            console.error('Error fetching user details:', error);
            this.isLoading = false;
            this.canViewCommissions = false;
            this.error = 'Failed to load user details';
          }
        });
      } else {
        this.isLoading = false;
        this.canViewCommissions = false;
        this.error = 'Unauthorized access';
      }
    }
  }

  async loadData(): Promise<void> {
    if (!this.partnerId) {
      this.error = 'No partner associated with this user';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const [summary, commissions] = await Promise.all([
        this.commissionService.getCommissionSummary(this.partnerId).toPromise(),
        this.commissionService.getCommissionsByPartner(this.partnerId).toPromise()
      ]);

      if (summary && commissions) {
        this.summary = {
          total: summary.total,
          pending: summary.pending,
          paid: summary.paid
        };
        this.commissions = commissions.map((commission: Commission): Commission => ({
          commissionId: commission.commissionId,
          partnerId: commission.partnerId,
          partnerName: commission.partnerName,
          amount: commission.amount,
          paidOut: commission.paidOut,
          status: commission.paidOut ? 'PAID' : 'PENDING',
          description: commission.description || '',
          calculatedAt: new Date(commission.calculatedAt),
          updatedAt: commission.updatedAt ? new Date(commission.updatedAt) : undefined
        }));
      } else {
        throw new Error('Failed to load commission data');
      }
    } catch (error) {
      this.error = 'An error occurred while loading commission data';
      console.error('Error loading commission data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'accent';
      case 'paid':
        return 'primary';
      default:
        return '';
    }
  }

  retry(): void {
    this.loadData();
  }
}