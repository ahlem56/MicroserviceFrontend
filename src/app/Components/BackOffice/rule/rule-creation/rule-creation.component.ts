import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from 'src/app/Core/admin.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-creation',
  templateUrl: './rule-creation.component.html',
  styleUrls: ['./rule-creation.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class RuleCreationBackOfficeComponent implements OnInit {

  ruleForm!: FormGroup;
  rulesExist: boolean = false;
  headers!: HttpHeaders;

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.ruleForm = this.fb.group({
      pointsForJoin: [0, Validators.required],
      pointsForCancel: [0, Validators.required],
      pointsDeductedPerInactiveDay: [0, Validators.required],
      inactiveDaysThreshold: [0, Validators.required],
      topActivePointsThreshold: [0, Validators.required],
      contributeurPointsThreshold: [0, Validators.required]
    });

    this.adminService.getRules(this.headers).subscribe({
      next: (rules) => {
        if (rules) {
          this.ruleForm.patchValue(rules);
          this.rulesExist = true;
        }
      },
      error: (err) => {
        console.error("❌ Erreur lors de la récupération des règles", err);
      }
    });
  }

  onSubmit(): void {
    if (this.ruleForm.invalid) {
      alert("❗ Merci de remplir tous les champs obligatoires.");
      return;
    }

    if (this.rulesExist) {
      this.adminService.updateRules(this.ruleForm.value, this.headers).subscribe({
        next: () => alert("✅ Règles mises à jour avec succès !"),
        error: (err) => {
          alert("❌ Erreur lors de la mise à jour");
          console.error(err);
        }
      });
    } else {
      this.adminService.createRules(this.ruleForm.value, this.headers).subscribe({
        next: () => {
          alert("✅ Règles créées avec succès !");
          this.rulesExist = true;
        },
        error: (err) => {
          alert("❌ Erreur lors de la création");
          console.error(err);
        }
      });
    }
  }
}
