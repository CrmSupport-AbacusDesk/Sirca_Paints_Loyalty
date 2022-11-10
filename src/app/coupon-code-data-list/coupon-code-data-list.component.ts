import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-coupon-code-data-list',
  templateUrl: './coupon-code-data-list.component.html',
  styleUrls: ['./coupon-code-data-list.component.scss']
})
export class CouponCodeDataListComponent implements OnInit {
  loading_list:boolean=false;
  couponCodeList:any=[];
  filter:any={};
  current_page = 1;
  last_page: number ;
  total_karigars = 0;
  karigar_all:any =0;
  

  constructor(public router:Router, public db:DatabaseService ) {
    this.getCouponCodeList();
   }
  ngOnInit() {
  }

 
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }

  redirect_previous() {
    this.current_page--;
    this.getCouponCodeList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getCouponCodeList();
  }

  getCouponCodeList(){
    this.loading_list=true;
    this.db.post_rqst({'filter':this.filter},'offer/qrCodeList?page='+this.current_page).subscribe((res)=>{
      console.log(res);
      this.loading_list=false;

      this.current_page = res['secondary_qr_code_list'].current_page;
      this.last_page = res['secondary_qr_code_list'].last_page;
      this.total_karigars =res['secondary_qr_code_list'].total;
      this.couponCodeList = res['secondary_qr_code_list']['data'];
      
      this.karigar_all = res.karigar_all;
    },err=>{
      this.loading_list=false;

    })

  }

  changeDate(event:any){
    console.log(event.target.value);
    this.filter.valid_from=moment(this.filter.valid_from).format('YYYY-MM-DD');
  }
  changeDateFormat(event:any){
    console.log(event.target.value);
    this.filter.date=moment(this.filter.date).format('YYYY-MM-DD');
  }


  changeDate2(event:any){
    console.log(event.target.value);

    this.filter.valid_to=moment(this.filter.valid_to).format('YYYY-MM-DD');

  }

  couponAdd(){

    this.router.navigate(['/coupon-code-add']);

  }

}
