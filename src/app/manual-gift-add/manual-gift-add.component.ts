import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { SessionStorage } from 'src/app/_services/SessionService'

@Component({
  selector: 'app-manual-gift-add',
  templateUrl: './manual-gift-add.component.html',
  styleUrls: ['./manual-gift-add.component.scss']
})
export class ManualGiftAddComponent implements OnInit {
  remark_text:any
  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve:DatabaseService,public session:SessionStorage,public dialogRef:MatDialogRef<ManualGiftAddComponent>,public dialog:DialogComponent) { }

  ngOnInit() {
  }

  remark_save(){
    
  }

}
