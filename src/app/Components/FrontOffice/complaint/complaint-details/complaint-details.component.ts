import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from 'src/app/Core/complaint.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.css'],
})
export class ComplaintDetailsFrontOfficeComponent implements OnInit {
  complaintId: number | null = null;
  complaint: any = null;

  constructor(private route: ActivatedRoute, private complaintService: ComplaintService,private router: Router
  ) {}

  ngOnInit() {
    this.complaintId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.complaintId) {
      const token = localStorage.getItem('token'); // Récupérer le token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.complaintService.getComplaintById(this.complaintId, headers).subscribe(
        (complaint) => {
          this.complaint = complaint;
        },
        (error) => {
          console.error('Error fetching complaint details', error);
        }
      );
    }
  }


  goToComplaintList() {
    this.router.navigate(['/complaints/list']);
  }
}
