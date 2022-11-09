import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DialogComponent } from '../dialog/dialog.component';
import { DatabaseService } from '../_services/DatabaseService';
import { SessionStorage } from '../_services/SessionService';

@Component({
  selector: 'app-coupon-add',
  templateUrl: './coupon-add.component.html',
  styleUrls: ['./coupon-add.component.scss']
})
export class CouponAddComponent implements OnInit {
  history:{};
  siteform:any={};
  filter:any={};  
  loading_list:boolean=false;
  productList:any=[];
  productList2:any=[];
  todayDate:any=new Date();
  temp_search='';
  loginId:any;
  constructor(public db: DatabaseService,public session:SessionStorage,public dialog: DialogComponent ) {
    console.log(this.session.users);
    this.loginId=this.session.users.id;
    this.getProductList('');

   }

  ngOnInit() {
  }

  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  getProductList(value){
    this.loading_list=true;
    this.db.post_rqst({'filter':value},'master/couponProductList').subscribe((result)=>{
      console.log(result);
      this.productList=result;
      this.productList2=result;
    this.loading_list=false;

    },err=>{
    this.loading_list=false;

    })
  }

  redirect_previous(){

  }

  redirect_next(){

  }

  getCouponDetail(){

  }
  openDatePicker(){

  }
  downloadCoupon(){

  }

  deleteCoupon(){

  }

  savesiteform(f){
    console.log(f);
    this.loading_list=true;
    this.siteform.created_by=this.loginId;
    console.log(this.todayDate);

    this.db.post_rqst({'data':this.siteform},'offer/generateSecondaryQrCode').subscribe((res)=>{
      console.log(res);
    this.loading_list=false;
      if(res['status']=='Success'){
        this.dialog.success( 'Coupon has been successfully Generated');
      }
    },err=>{
    this.loading_list=false;

    })

  }

  

  checkDateOfManufacturing(event){

    if(event.checked==true){
      this.siteform.manufacturing_date=moment(this.todayDate).format('YYYY-MM-DD')
    }else{
      this.siteform.manufacturing_date='';
    }


  }

  searchProductList(product_name){
    console.log(product_name);
    console.log(this.productList2);
    this.temp_search='';
    this.productList=[];
    for(let x=0; x<this.productList2.lengthx;x++){
      product_name=product_name.toLowerCase();
      this.temp_search=this.productList2[x].product_name.toLowerCase();
      if(this.temp_search.includes(product_name)){
        this.productList.push(this.productList2[x]);
      }
    }


  }

}
