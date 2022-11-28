import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss']
})
export class EditStatusComponent implements OnInit {
  edit:any={};
  savingData:boolean=false;
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<EditStatusComponent>) { 
      console.log(model_data)
      this.edit.site_status=model_data.status
    }

  ngOnInit() {
  }


  changeEditStatus(f){
    console.log(f);
    this.db.post_rqst({'id':this.model_data.id,'site_status':this.edit.site_status},'master/siteStatusUpdate').subscribe(res=>{
      console.log(res);
      if(res['status']=='SUCCESS'){
        this.dialog.success("Success Updated");

        this.dialogRef.close();
      }else{
        this.dialog.error("Something Went Wrong... Please Wait");

      }
    },err=>{

    })

  }

}
