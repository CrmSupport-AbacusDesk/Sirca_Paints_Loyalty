import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DialogComponent } from '../dialog/dialog.component';
import { DatabaseService } from '../_services/DatabaseService';
import { SessionStorage } from '../_services/SessionService';

@Component({
  selector: 'app-scheme-add',
  templateUrl: './scheme-add.component.html',
  styleUrls: ['./scheme-add.component.scss']
})
export class SchemeAddComponent implements OnInit {
  siteform:any={};
  date1:any;
  loading_list:any
  loginId:any;
  pc:any=[];
  categoryList:any=[];
  id:any;
  constructor(public db:DatabaseService , public session:SessionStorage,public route:ActivatedRoute ,  public dialog:DialogComponent, public router:Router) { 
    this.date1 = new Date();
    this.loginId=this.session.users.id;
    this.getPc('');
    this.getCategoryList('');
  }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      console.log(params);
    this.id=params['id'];
    console.log(this.id);

  });
  if(this.id){
    this.schemeDetail();
  }else{
    this.id=0;
  }
  }

  openDatePicker(picker : MatDatepicker<Date>)
  {
      picker.open();
  }

  openDatePicker2(picker : MatDatepicker<Date>)
  {
      picker.open();
  }

  schemeDetail(){
    this.loading_list=true;
    this.db.post_rqst({'id':this.id},'offer/schemeDetail').subscribe((res)=>{
      console.log(res);
      this.loading_list=false;
      this.siteform=res['schemeDetail'];

    },err=>{
      this.loading_list=false;
    })



  }


  saveSchemeform(f){
    this.loading_list=true;
    this.siteform.created_by=this.loginId;
    this.siteform.id=this.id;
    this.siteform.valid_from=moment(this.siteform.valid_from).format('YYYY-MM-DD');
    this.siteform.valid_to=moment(this.siteform.valid_to).format('YYYY-MM-DD');
    this.db.post_rqst({'data':this.siteform},'offer/addScheme').subscribe((res)=>{
        console.log(res);
      this.loading_list=false;
      if(res['status']=='Success'){
        this.dialog.success('Added Successfully');
        this.router.navigate(['/schemeList']);
      }else{
        this.dialog.error('Something Went Wrong... Please Try Again.');

      }

    },err=>{
      this.loading_list=false;
    })

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getPc(search){
    let filter={};
    filter={
        mode:0
    };
    this.db.post_rqst({'filter':filter}, 'karigar/contractorList')
    .subscribe(d => { 
      console.log(d);
      this.pc = d.contractorData['data'];
    },error=>{
      this.loading_list=false;
    });
  }
  getCategoryList(search){
    let filter={};
    // filter.search=search
    this.db.post_rqst({'filter':search}, 'offer/get_categories')
    .subscribe(d => { 
      console.log(d);
      this.categoryList = d.category;
    },error=>{
      this.loading_list=false;
    });
  }

}
