import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-complaint-remark',
  templateUrl: './complaint-remark.component.html',
})
export class ComplaintRemarkComponent implements OnInit {
  data: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  remark:any = [];
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ComplaintRemarkComponent>) {
      
      this.data.id = model_data.id; 
    }
    ngOnInit() {

      this.addCompalintStatus();
     
    }
   
    addCompalintStatus()
    {

      this.db.post_rqst( { 'id': this.data.id }, 'karigar/complaintRemark')
      .subscribe( d => {

        this.remark = d.remark;
        console.log( this.remark );
        
      });
    }

  }
  