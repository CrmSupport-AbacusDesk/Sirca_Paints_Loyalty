import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import { ComplaintsChangeStatusComponent } from '../complaints/complaints-change-status/complaints-change-status.component';
import { ComplaintsNatureProblemComponent } from '../complaints/complaints-nature-problem/complaints-nature-problem.component';
import { ComplaintsAssignPlumberComponent } from '../complaints/complaints-assign-plumber/complaints-assign-plumber.component';
import { ActivatedRoute } from '@angular/router';
import { ComplaintRemarkModalComponent } from './complaint-remark-modal/complaint-remark-modal.component';





@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
})
export class ComplaintsComponent implements OnInit {

  loading_list = false;
  karigars: any = [];
  total_karigars = 0;

  last_page: number;
  current_page = 1;
  search: any = '';
  filter: any = {};
  filtering: any = false;
  data: any = {};
  com_all: any = 0;
  com_assign: any = 0;
  com_cancel: any = 0;
  com_closed: any = 0;
  com_pending: any = 0;

  constructor(public db: DatabaseService, public route: ActivatedRoute, public dialog: DialogComponent, public alrt: MatDialog, private dialogRef:MatDialog) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.current_page = 0;
      this.last_page = 0;
      this.total_karigars = 0
      this.karigars = [];

      this.com_all = 0;
      this.com_assign = 0;
      this.com_cancel = 0;
      this.com_closed = 0;
      this.com_pending = 0;
      this.data.type = params.type;
      this.getComplaintsList(this.data.type);
      console.log(this.data.type);

      console.log("Page Detected : ", this.data.type);

    });
  }

  ngOnInit() {
    this.filter.status = '';
    this.getComplaintsList(this.data.type);
  }

  toInt(i) {
    return parseInt(i);
  }
  openDatePicker(picker: MatDatepicker<Date>) {
    picker.open();
  }
  redirect_previous() {
    this.current_page--;
    this.getComplaintsList(this.data.type);
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getComplaintsList(this.data.type);
  }

  getComplaintsList(type: any) {
    console.log(type);
    this.loading_list = true;
    this.filter.date = this.filter.date ? this.db.pickerFormat(this.filter.date) : '';
    if (this.filter.date) this.filtering = true;
    this.filter.mode = 0;
    this.db.post_rqst({ 'filter': this.filter, 'login': this.db.datauser, 'type': type }, 'karigar/complaintList?page=' + this.current_page)
      .subscribe(d => {
        this.loading_list = false;
        //console.log(d);

        this.current_page = d.karigars.current_page;
        this.last_page = d.karigars.last_page;
        this.total_karigars = d.karigars.total;
        this.karigars = d.karigars.data;
        console.log("karigars array",this.karigars);


        this.com_all = d.com_all;
        this.com_assign = d.com_assign;
        this.com_cancel = d.com_cancel;
        this.com_closed = d.com_closed;
        this.com_pending = d.com_pending;
      });
  }

  exportComplaint(page_type) {
    this.filter.mode = 1;
    this.db.post_rqst({ 'filter': this.filter, 'login': this.db.datauser, 'type': page_type }, 'karigar/exportComplaint')
      .subscribe(d => {
        document.location.href = this.db.myurl + '/app/uploads/exports/Complaint.csv';
        //console.log(d);
      });
  }

  deleteKarigar(id) {
    this.dialog.delete('Karigar').then((result) => {
      if (result) {
        this.db.post_rqst({ 'id': id }, 'karigar/remove')
          .subscribe(d => {
            //console.log(d);
            this.getComplaintsList(this.data.type);
            this.dialog.successfully();
          });
      }
    });
  }

  changeStatus(i, id, status) {

    console.log("Change status method calls : ");

    const dialogRef = this.alrt.open(ComplaintsChangeStatusComponent,
      {
        width: '500px',
        height: '300px',

        data: {
          'id': id,
          'status': status,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log("change status dialog box ", result)
      if (result) {
      console.log("change status after dialog box if condition")

        this.getComplaintsList(this.data.type);
      }
    });

  }


  changeNatureProblem(i, id, nature_problem) {

    console.log("Change Nature Problem status method calls : ");

    const dialogRef = this.alrt.open(ComplaintsNatureProblemComponent,
      {
        width: '500px',
        height: '500px',

        data: {
          'id': id,
          'nature_problem': nature_problem,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getComplaintsList(this.data.type);
      }
    });

  }

  assignPlumber(i, id, assigned_plumber) {

    const dialogRef = this.alrt.open(ComplaintsAssignPlumberComponent,
      {
        width: '500px',
        height: '500px',

        data: {
          'id': id,
          'assigned_plumber': assigned_plumber,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getComplaintsList(this.data.type);
      }
    });

  }

  //aamir change
  changeRemark(id,remark) {
  const dialogRef=  this.dialogRef.open(ComplaintRemarkModalComponent,{
      width:'500px',
      height:'500px',
      data:{
        'id':id,
        'remark':remark,
        'comes_from':'complaint_page_remark'
      }
    });
    
    dialogRef.afterClosed().subscribe((result=>{
     console.log("after closed remark  dialog box",result);
      if(result){
        this.getComplaintsList(this.data.type);
      }}));
   
  }


}

