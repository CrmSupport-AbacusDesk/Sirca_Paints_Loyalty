import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { MatDialog, MatDatepicker} from '@angular/material';


@Component({
  selector: 'app-coupon-code-upload',
  templateUrl: './coupon-code-upload.component.html',
})
export class CouponCodeUploadComponent implements OnInit {
  
  loading_list = false;
  coupon: any = {};
  history: any = {};
  savingData = false;
  date1;
  filter:any = {};
  filtering : any = false;
  product_name:any = '';
  getData:any = {};
  
  
  product_list_for_coupon_generate:any = [];
  tmp_product_list_for_coupon_generate:any = [];
  tmpsearch: string;
  show_primary:boolean = true;
  active_tab : any = 'show_primary';
  
  secondary_qr_code_list:any = []
  master_qr_code_list:any = []
  
  pagenumber:any = 0;
  total_page : any = 0
  page_limit:any=50;
  start:any=0;
  
  
  
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,public matDialog: MatDialog,  public dialog: DialogComponent) { this.date1 = new Date();
    console.log("Login User Data : ",this.db.datauser)
  }
  
  ngOnInit() {
    this.getCouponDetail();
    this.history.current_page = 1;
    this.secondary_qr_code_list.current_page = 1;
  }
  
  
  redirect_previous() {
    this.history.current_page--;
    this.getCouponDetail();
  }
  redirect_next() {
    if (this.history.current_page < this.history.last_page) { this.history.current_page++; }
    else { this.history.current_page = 1; }
    this.getCouponDetail();
  }
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }
  
  getCouponDetail() {
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    console.log(this.filter);
    
    this.loading_list = true;
    this.db.post_rqst(  { 'filter': this.filter ,'login':this.db.datauser}, 'offer/coupon_history?page=' + this.history.current_page).subscribe(d => {
      this.loading_list = false;
      this.history = d.coupon;
    });
  }
  
  saveCouponfrom(form:any) {
    
    if(this.coupon.total_coupon<=2500) {
      this.loading_list = true;
      this.savingData = true;
      this.coupon.created_by = this.db.datauser.id;
      
      this.db.post_rqst( { 'coupon' : this.coupon }, 'offer/generateCoupon')
      .subscribe( d => {
        if(d['status'] == 'Fields Reqired' ){
          this.dialog.error( 'Fields Required!');
          return;
        }
        form.resetForm();
        this.dialog.success( 'Coupon has been successfully Generated');
        this.savingData = false;
        this.loading_list = false;
        this.getCouponDetail();
      });
    }
    else
    {
      this.dialog.error( 'Can not Generate more than 2500 coupon codes at once!');
      
    }
  }
  
  downloadCoupon(id)
  {
    this.filter.mode = 1;
    this.db.post_rqst(  { 'id':  id }, 'offer/exportCoupon')
    .subscribe( d => {
      this.loading_list = false;
      document.location.href = this.db.myurl+'/app/uploads/exports/coupons.csv';
      //console.log(d);
    });
  }
  
  deleteCoupon(id) {
    this.dialog.delete('Coupon').then((result) => {
      if(result) {
        this.db.post_rqst({'id': id}, 'offer/deleteCoupon')
        .subscribe(d => {
          //console.log(d);
          this.getCouponDetail();
          this.dialog.successfully();
        });
      }
    });
  } 
  
  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  get_product_list_for_secondary_packing(filter_data:any=''){
    console.log('get_product_list_for_secondary_packing method calls');
    console.log(filter_data);
    this.loading_list = true;
    this.db.post_rqst({'filter':filter_data},'master/product_listing_for_secondary_bar_code').subscribe( result => {
      console.log(result);
      this.loading_list = false;
      this.product_list_for_coupon_generate = result['product_list'];
      for(let index = 0 ; index <= this.product_list_for_coupon_generate.length ; index++){
        console.log("for loop works");
        this.product_list_for_coupon_generate[index]['product_name'] = this.product_list_for_coupon_generate[index]['product_name'] + ' - ' + this.product_list_for_coupon_generate[index]['material_code'];
        this.tmp_product_list_for_coupon_generate = this.product_list_for_coupon_generate;
      }
      
    });
    
    
  }
  

  //front end filter , not use now
  filter_product(product_name){
    console.log("filter_product method calls");
    console.log(product_name);
    console.log(this.tmp_product_list_for_coupon_generate);
    this.tmpsearch='';
    this.product_list_for_coupon_generate = [];
    for (var i = 0; i < this.tmp_product_list_for_coupon_generate.length; i++) {
      product_name = product_name.toLowerCase();
      this.tmpsearch = this.tmp_product_list_for_coupon_generate[i]['product_name'].toLowerCase();
      if (this.tmpsearch.includes(product_name)) {
        this.product_list_for_coupon_generate.push(this.tmp_product_list_for_coupon_generate[i]);
      }
    }
  }
  
  generate_secondary_or_master_coupon(form:any , type) {
    
    
    if(type == 'Secondary'){
      if(this.coupon.total_coupon<=2500) {
        this.loading_list = true;
        this.savingData = true;
        this.coupon.created_by = this.db.datauser.id;
        
        this.db.post_rqst( {'secondary_coupon' : this.coupon }, 'offer/generateSecondaryQrCode')
        .subscribe( result => {
          console.log(result);
          if(result['status']=="Success"){
            form.resetForm();
            this.dialog.success( 'Coupon has been successfully Generated');
            this.savingData = false;
            this.loading_list = false;
            this.get_secondary_coupon();
            
          }
          else{
            
            this.dialog.error( 'Something Went Wrong, Please Try Again !');
            this.savingData = false;
            this.loading_list = false;
            
          }
          
          // this.getCouponDetail();
        });
      }
      else
      {
        this.dialog.error( 'Can not Generate more than 2500 coupon codes at once!');
        
      }
      
    }
    
    else if(type == 'Master'){
      
      if(this.coupon.total_coupon<=2500) {
        this.loading_list = true;
        this.savingData = true;
        this.coupon.created_by = this.db.datauser.id;
        
        this.db.post_rqst( {'master_coupon' : this.coupon }, 'offer/generateMasterQrCode')
        .subscribe( result => {
          console.log(result);
          if(result['status']=="Success"){
            form.resetForm();
            this.dialog.success( 'Coupon has been successfully Generated');
            this.savingData = false;
            this.loading_list = false;
            this.get_master_coupon();
            
          }
          else{
            this.dialog.error( 'Something Went Wrong, Please Try Again !');
            this.savingData = false;
            this.loading_list = false;
          }
          
        });
      }
      else
      {
        this.dialog.error( 'Can not Generate more than 2500 coupon codes at once!');
        
      }
      
    }
    
  }
  
  get_secondary_coupon() {
    this.filter.date_created = this.filter.date_created  ? this.db.pickerFormat(this.filter.date_created) : '';
    this.loading_list = true;
    this.db.post_rqst(  { 'filter': this.filter ,'login':this.db.datauser}, 'offer/secondaryQrCodeList?page=' + this.secondary_qr_code_list.current_page).subscribe(result => {
      this.loading_list = false;
      console.log(result);
      this.secondary_qr_code_list = result['secondary_qr_code_list']
    });
  }
  
  delete_qr_code_list(id,type){
    console.log("delete_qr_code_list method calls");
    console.log(id);
    console.log(type);
    
    if(type == 'secondary'){
      this.loading_list = true;
      
      this.dialog.delete('Coupon Data').then((result) => {
        if(result) {
          this.db.post_rqst({'id': id}, 'offer/deleteSecondaryCoupon')
          .subscribe(d => {
            this.loading_list = false;
            if(d['msg'] == 'Already Scanned'){ 
              this.dialog.error(d['msg']);
            }
            else{
              this.get_secondary_coupon();
              this.dialog.successfully();
            }
          });
        }
      });
      
    }
    
    else if(type == 'master'){
      this.loading_list = true;
      
      this.dialog.delete('Coupon Data').then((result) => {
        if(result) {
          this.db.post_rqst({'id': id}, 'offer/deleteMasterCoupon')
          .subscribe(d => {
            this.loading_list = false;
            this.get_master_coupon();
            this.dialog.successfully();
          });
        }
      });
      
    }
    
    
  }
  
  download_qr_code_data(id,type){
    
    console.log("download_qr_code_data method calls");
    console.log(id);
    console.log(type);
    
    if(type == 'secondary'){
      this.filter.mode = 1;
      this.db.post_rqst(  { 'id':  id }, 'offer/exportSecondaryCoupon')
      .subscribe( d => {
        this.loading_list = false;
        document.location.href = this.db.myurl+'/app/uploads/exports/secondaryCoupons.csv';
      });
    }
    else if(type == 'master'){
      this.filter.mode = 1;
      this.db.post_rqst(  { 'id':  id }, 'offer/exportMasterCoupon')
      .subscribe( d => {
        this.loading_list = false;
        document.location.href = this.db.myurl+'/app/uploads/exports/masterCoupons.csv';
      });
    }
  }
  
  
  get_master_coupon() {
    this.filter.date_created = this.filter.date_created  ? this.db.pickerFormat(this.filter.date_created) : '';
    this.loading_list = true;
    this.db.post_rqst(  { 'filter': this.filter , 'login':this.db.datauser }, 'offer/masterQrCodeList?page=' + this.master_qr_code_list.current_page).subscribe(result => {      
      this.loading_list = false;
      console.log(result);
      this.master_qr_code_list = result['master_qr_code_list']
    });
  }
  
}
