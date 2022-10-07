import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-change-karigar-status',
  templateUrl: './change-karigar-status.component.html',
})
export class ChangeKarigarStatusComponent implements OnInit {
  id: any = {};
  status: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  complaint:any = {};
  Verified: any;
  all_distributor: any={};
  modalType:any ={}
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ChangeKarigarStatusComponent>) {
      console.log(model_data);
      this.modalType = model_data.type
      this.id = model_data.karigar_id;
      this.complaint.status = model_data.status;
      if(this.modalType  == 'remark'){

        this.complaint.status_remark = model_data.status_remark;
      }

      // this.complaint.status1 = this.status.company_name;
    }
    ngOnInit() {
      this.getDistributorList('');
    }
    
    getDistributorList(event) {
      
      this.db.fetchData({'search': event}, 'Distributors/all_distributors').subscribe((result => {
        console.log(result);
        this.savingData = false;
        this.all_distributor = result;
        console.log(this.all_distributor);
      }
      ));
    }
    addCompalintStatus(form: any)
    {
      // this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;
      this.complaint.karigar_id = this.id;
      this.dialogRef.close();
      this.db.post_rqst( this.complaint , 'karigar/karigarStatus')
      .subscribe( d => {
        const companyIndex = this.status.all_distributor.all_distributor.findIndex(row => row.id == this.complaint.dr_id);
        this.complaint.company_name = this.complaint.all_distributor.all_distributor[companyIndex].company_name;
        this.savingData = false;
        this.dialog.success( 'Status successfully Change');
        this.dialogRef.close(true);
        //console.log( d );
      });
    }
    
    
    updateStatus(form: any)
    {
      // this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;
      this.complaint.id = this.id;
      this.dialogRef.close();
      this.db.post_rqst( this.complaint , 'karigar/updatekarigarStatusRemark')
      .subscribe( d => {
        console.log(d);
        
        if(d.status == 'SUCCESS'){
          this.savingData = false;
          this.dialog.success( 'Remark successfully update');
          this.dialogRef.close(true);
        }
        
        
        //console.log( d );
      });
    }
    
    
    onNoClick(): void{
      this.dialogRef.close();
    }
  }
  