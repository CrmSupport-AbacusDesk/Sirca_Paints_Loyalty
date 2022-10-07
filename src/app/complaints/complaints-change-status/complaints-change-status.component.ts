import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-complaints-change-status',
  templateUrl: './complaints-change-status.component.html',
})
export class ComplaintsChangeStatusComponent implements OnInit {
  data: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  complaint:any = {};
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ComplaintsChangeStatusComponent>) {
      console.log(model_data);
      
      this.data.id = model_data.id; 
      this.data.complaint_status = model_data.status; 
      this.data.type = model_data.type; 
      if(this.data.type=='payment')
      {
        this.data.complaintId = model_data.complaintId; 
        this.data.plumberId = model_data.plumberId; 
        
      }
      
    }
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.gift_id = params['gift_id'];
        this.complaint.complaint_status = this.data.complaint_status; 
        //console.log( this.complaint );
        
      });
    }
    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      // //console.log(event.keyCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    addCompalintStatus(form:any)
    {
      this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;
      
      this.db.post_rqst( { 'status' : this.complaint ,'id': this.data.id }, 'karigar/complaintStatus')
      .subscribe( d => {
        this.savingData = false;
        this.dialog.success( 'Status successfully Change');
        this.dialogRef.close(true);
        //console.log( d );
      });
    }
    appComplaintPayment(form:any){
      this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;
      console.log(this.data);
      console.log(this.complaint);
      this.complaint.complaintId = this.data.complaintId
      this.complaint.plumberId = this.data.plumberId
      this.db.post_rqst( { 'data' : this.complaint  }, 'karigar/complaintPayment')
      .subscribe( d => {
        this.savingData = false;
        this.dialog.success( 'Payment Added Successfully');
        this.dialogRef.close(true);
      });
    }
      
    onNoClick(): void{
      this.dialogRef.close();
    }
  }
  