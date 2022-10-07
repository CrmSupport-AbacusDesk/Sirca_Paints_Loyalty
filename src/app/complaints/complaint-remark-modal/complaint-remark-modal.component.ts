import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { SessionStorage } from 'src/app/_services/SessionService';

@Component({
  selector: 'app-complaint-remark-modal',
  templateUrl: './complaint-remark-modal.component.html',
  styleUrls: ['./complaint-remark-modal.component.scss']
})
export class ComplaintRemarkModalComponent implements OnInit {

  current_page=0;
  remark_text:any;
  serviceid:any;
  login_data:any;
  comes_from:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve:DatabaseService,public session:SessionStorage,public dialogRef:MatDialogRef<ComplaintRemarkModalComponent>,public dialog:DialogComponent) {


    this.serviceid=data.id;

    console.log(this.serviceid);
    
    this.remark_text=data.remark;

    this.comes_from = data.comes_from
    

    this.login_data=this.session.users.id;
    console.log("login session mat dialog remark page", this.login_data);
    
    // this.user_id.id=this.data.id;
   }

  ngOnInit() {
  }

  remark_array:any=[]
  remark_save(){
    console.log("remark save work");
    console.log(this.remark_text);
    this.serve.post_rqst({'remark_status':this.remark_text,'login_id':this.login_data,'complaint_id':this.serviceid},'karigar/updateStatusRemark').subscribe((response_remark=>{
      console.log("response remark save button",response_remark);
      if(response_remark.status == 'success'){
        this.dialog.success("Remark Updated Successfully");
      }else{
        this.dialog.error("Oops.. Remark not saved");
      }
    }));
    this.dialogRef.close(true);
  }

 
}
