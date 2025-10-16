import { Component, OnInit } from '@angular/core';
import { OwnerService } from './owner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  owners: any[] = [];
  ownerForm: any = {};
  isEditMode = false;
  selectedId: number | null = null;

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners(): void {
    this.ownerService.getOwners().subscribe({
      next: (data) => this.owners = data,
      error: (err) => console.error('Error loading owners', err)
    });
  }

  saveOwner(): void {
    if (this.isEditMode && this.selectedId !== null) {
      this.ownerService.updateOwner(this.selectedId, this.ownerForm).subscribe({
        next: () => {
          this.resetForm();
          this.loadOwners();
        },
        error: (err) => console.error('Error updating owner', err)
      });
    } else {
      this.ownerService.registerOwner(this.ownerForm).subscribe({
        next: () => {
          this.resetForm();
          this.loadOwners();
        },
        error: (err) => console.error('Error creating owner', err)
      });
    }
  }

  editOwner(owner: any): void {
    this.ownerForm = { ...owner };
    this.selectedId = owner.id;
    this.isEditMode = true;
  }

  deleteOwner(id: number): void {
    if (confirm('Are you sure you want to delete this owner?')) {
      this.ownerService.deleteOwner(id).subscribe({
        next: () => this.loadOwners(),
        error: (err) => console.error('Error deleting owner', err)
      });
    }
  }

  resetForm(): void {
    this.ownerForm = {};
    this.selectedId = null;
    this.isEditMode = false;
  }
}
