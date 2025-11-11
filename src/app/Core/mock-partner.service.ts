import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Partner, Promotion } from '../Models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class MockPartnerService {
  private mockPartners: Partner[] = [
    {
      partnerId: 101,
      partnerCode: 1001,
      partnerName: 'Louati Amin',
      partnerContactInfo: 'amiin@esprit.tn',
      partnershipDuration: 5,
      commissionRate: 0.15,
      totalCommission: 1500.00,
      promotions: {
        promotionTitle: 'Silver Tier Promotion',
        promotionDescription: 'Silver tier benefits',
        promotionDiscountPercentage: 10,
        promotionStartDate: '2025-04-01',
        promotionEndDate: '2025-10-01'
      }
    },
    {
      partnerId: 102,
      partnerCode: 1002,
      partnerName: 'Louati Amin',
      partnerContactInfo: 'test@example.com',
      partnershipDuration: 5,
      commissionRate: 0.10,
      totalCommission: 750.00
    },
    {
      partnerId: 103,
      partnerCode: 1003,
      partnerName: 'sfsd dfgg',
      partnerContactInfo: 'commission@example.com',
      partnershipDuration: 6,
      commissionRate: 0.20,
      totalCommission: 2500.00,
      promotions: {
        promotionTitle: 'Gold Tier Promotion',
        promotionDescription: 'Gold tier benefits',
        promotionDiscountPercentage: 20,
        promotionStartDate: '2025-04-01',
        promotionEndDate: '2025-10-01'
      }
    },
    {
      partnerId: 106,
      partnerCode: 1006,
      partnerName: 'Partner User',
      partnerContactInfo: 'partner@speedygo.com',
      partnershipDuration: 12,
      commissionRate: 0.15,
      totalCommission: 1000.00
    },
    {
      partnerId: 108,
      partnerCode: 1008,
      partnerName: 'Partner User',
      partnerContactInfo: 'partner2@speedygo.com',
      partnershipDuration: 12,
      commissionRate: 0.15,
      totalCommission: 1200.00,
      promotions: {
        promotionTitle: 'Silver Tier Promotion',
        promotionDescription: 'Silver tier benefits',
        promotionDiscountPercentage: 10,
        promotionStartDate: '2025-04-01',
        promotionEndDate: '2025-10-01'
      }
    },
    {
      partnerId: 109,
      partnerCode: 1009,
      partnerName: 'partner partner',
      partnerContactInfo: 'partner1@test.com',
      partnershipDuration: 12,
      commissionRate: 0.15,
      totalCommission: 800.00
    }
  ];

  constructor() { }

  getPartners(): Observable<Partner[]> {
    console.log('Using mock partners data');
    return of(this.mockPartners);
  }

  getPartnerById(id: number): Observable<Partner> {
    const partner = this.mockPartners.find(p => p.partnerId === id);
    return of(partner || this.mockPartners[0]);
  }
}