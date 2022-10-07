import { NgModule } from '@angular/core';

import 
{ 
  MatMenuModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatExpansionModule,
  MatRadioModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  // MatAutocomplete,

  
}from '@angular/material';

@NgModule({
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    // MatAutocomplete,


  ],
  
  exports: [
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    // MatAutocomplete,
 
  ],
})

export class MaterialModule  { }
export class DatepickerModule {}