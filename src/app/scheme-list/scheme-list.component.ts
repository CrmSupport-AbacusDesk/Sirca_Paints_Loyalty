import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.scss']
})
export class SchemeListComponent implements OnInit {

  loading_list:boolean=false;
  schemeList:any=[];
  filter:any={};
  current_page = 1;
  last_page: number ;
  total_karigars = 0;
  karigar_all:any =0;
  

  constructor(public router:Router, public db:DatabaseService ) {
    this.getSchemeList();
   }

  ngOnInit() {
  }
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }

  redirect_previous() {
    this.current_page--;
    this.getSchemeList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getSchemeList();
  }

  getSchemeList(){
    this.loading_list=true;
    this.db.post_rqst({'filter':this.filter},'offer/schemeList?page='+this.current_page).subscribe((res)=>{
      console.log(res);
      this.loading_list=false;

      this.current_page = res['schemeList'].current_page;
      this.last_page = res['schemeList'].last_page;
      this.total_karigars =res['schemeList'].total;
      this.schemeList = res['schemeList']['data'];
      
      this.karigar_all = res.karigar_all;
    },err=>{
      this.loading_list=false;

    })

  }

  changeDate(event:any){
    console.log(event.target.value);
    this.filter.valid_from=moment(this.filter.valid_from).format('YYYY-MM-DD');
  }

  changeDate2(event:any){
    console.log(event.target.value);

    this.filter.valid_to=moment(this.filter.valid_to).format('YYYY-MM-DD');

  }

  schemeAdd(){

    this.router.navigate(['/schemeAdd']);

  }

}
