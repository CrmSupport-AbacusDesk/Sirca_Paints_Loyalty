import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import { ImportStatusModelComponent } from '../../offer/import-status-model/import-status-model.component';
import { ComplaintsNatureProblemComponent } from 'src/app/complaints/complaints-nature-problem/complaints-nature-problem.component';

@Component({
  selector: 'app-coupon-code-list',
  templateUrl: './coupon-code-list.component.html',
})
export class CouponCodeListComponent implements OnInit {
  
  loading_list = false;
  coupon: any = [];
  total_coupon = 0;
  avialable_coupon_count:any=0;
  redeem_coupon_count:any=0;
  sccaned_coupon_count:any=0;
  scanned_coupon:any=[];
  total_scanned_coupon:any={};
  formData = new FormData();
  exist_coupon:any=[];
  coupon_ex:any = '';
  file:any = {};
  
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  searchData = true;
  filter:any = {};
  filtering : any = false;
  redeem_coupon:any=[];
  
  coupon_all:any =0;
  coupon_available_count : any = 0;
  coupon_scanned_count : any = 0;
  coupon_redeem_count : any = 0;
  
  available_secondary_qr_code_list:any = [];
  available_secondary_qr_code_coupon_count:any = 0;
  
  scanned_secondary_qr_code_list:any = [];
  scanned_secondary_qr_code_coupon_count:any = 0;
  
  available_master_qr_code_list:any = [];
  available_master_qr_code_coupon_count:any = 0;
  
  scanned_master_qr_code_list:any = [];
  scanned_master_qr_code_coupon_count:any = 0;
  date1:any;
  
  constructor(public db: DatabaseService, public dialog: DialogComponent,public alrt:MatDialog ) {
    this.date1 = new Date();
  }
  
  mode:any='available_primary';
  ngOnInit() {
    this.getAvailableCoupanList('');
    // this. getScannedList('');
    this.filter.status = '';
  }
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }
  
  redirect_previous1() {
    this.current_page--;
    this.getAvailableCoupanList('');
  }
  redirect_next1() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getAvailableCoupanList('');
  }
  
  redirect_previous2() {
    this.current_page--;
    this.getScannedList('');
  }
  redirect_next2() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getScannedList('');
  }
  
  getAvailableCoupanList(action:any) 
  {
    //console.log( 'INN');
    
    if(action == 'refresh')
    {
      this.filter = {};
    }
    
    this.loading_list = true;
    this.filtering = false;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    this.filter.scan_date = this.filter.scan_date  ? this.db.pickerFormat(this.filter.scan_date) : '';
    this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
    this.filter.date_to = this.filter.date_to  ? this.db.pickerFormat(this.filter.date_to) : '';
    this.filter.date_from = this.filter.date_from  ? this.db.pickerFormat(this.filter.date_from) : '';
    
    
    if( this.filter.date || this.filter.date_from ||  this.filter.date_to || this.filter.scan_date || this.filter.end_date  || this.filter.search || this.filter.coupon_code || this.filter.offer_title || this.filter.points)this.filtering = true;
    
    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'offer/couponAvailableList?page=' + this.current_page)
    .subscribe( d => {
      this.loading_list = false;
      //console.log(d);
      
      this.current_page = d.avialable_coupon.current_page;
      this.last_page = d.avialable_coupon.last_page;
      this.total_coupon =d.avialable_coupon.total;
      this.coupon = d.avialable_coupon.data;
      this.avialable_coupon_count = d.avialable_coupon.total;
      this.sccaned_coupon_count = d.coupon_scanned_count;
    });
  }
  
  
  exportAvailableCouponList(tab_type)
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser,'mode':tab_type}, 'offer/exportAvailableCouponList')
    .subscribe( d => {
      this.loading_list = false;
      document.location.href = this.db.myurl+'/app/uploads/exports/Available-coupon-code.csv';
      //console.log(d);
    });
  }
  
  
  getScannedList(action:any) 
  {
    console.log(action);
    
    if(action == 'refresh')
    {
      this.filter = {};
    }
    
    console.log(this.filter);
    
    
    this.loading_list = true;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    this.filter.scan_date = this.filter.scan_date  ? this.db.pickerFormat(this.filter.scan_date) : '';
    this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
    this.filter.date_to = this.filter.date_to  ? this.db.pickerFormat(this.filter.date_to) : '';
    this.filter.date_from = this.filter.date_from  ? this.db.pickerFormat(this.filter.date_from) : '';
    
    if( this.filter.date || this.filter.date_from ||  this.filter.date_to || this.filter.scan_date || this.filter.end_date  || this.filter.search || this.filter.coupon_code || this.filter.offer_title || this.filter.points || this.filter.mobile || this.filter.used_by)this.filtering = true;
    this.filter.mode = 0;
    
    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'offer/couponScannedList?page=' + this.current_page)
    .subscribe( d => {
      this.loading_list = false;
      //console.log(d);
      
      this.current_page = d.scanned_coupon.current_page;
      this.last_page = d.scanned_coupon.last_page;
      this.total_scanned_coupon =d.scanned_coupon.total;
      this.scanned_coupon = d.scanned_coupon.data;
      this.sccaned_coupon_count = d.scanned_coupon.total;
      this.avialable_coupon_count = d.coupon_available_count;
      
    });
  }
  
  exportScannedCouponList()
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'offer/exportScannedCouponList')
    .subscribe( d => {
      this.loading_list = false;
      document.location.href = this.db.myurl+'app/uploads/exports/scanned-coupon-list.csv';
      //console.log(d);
    });
  }
  
  
  onUploadChange1(evt: any,f) {
    //console.log(f);
    
    this.file = evt.target.files[0];
    f.resetForm();
    
    //console.log(this.file);
    
    this.uploadCoupon();
    
  }
  
  
  uploadCoupon(){
    this.loading_list = true; 
    this.formData.append('coupon', this.file, this.file.name);
    
    // this.formData.append('offer_id', this.offer_id);
    
    this.db.fileData( this.formData, 'app_master/couponExcel').subscribe(d => {  
      this.loading_list = false;
      this.formData = new FormData();
      if(d['status'] == 'BLANK'){
        this.dialog.success('File is Blank');
        return;
      }
      
      if(d['status'] == 'INCORRECT FILE'){
        this.dialog.success('File Data is incorrect');
        return;
      }
      
      
      if(d['status'] == 'INCORRECT FORMAT'){
        this.dialog.success('File Format is incorrect! only CSV Support');
        return;
      }
      
      if(d['status'] == 'SIZE SHORT'){
        this.dialog.success('CSV File To Sort ');
        return;
      }
      
      if(d['status'] == 'UPLOAD' ){
        
        
        if( d['exist_coupon'].length > 0 )
        {
          const dialogRef = this.alrt.open(ImportStatusModelComponent,{
            width: '650px',
            height:'500px',
            data: {
              'exist_coupon' : d['exist_coupon'],
            }
          });
          dialogRef.afterClosed().subscribe(result => {   
            //console.log(`Dialog result: ${result}`);
          });
          
          if(d['upload_count'] > 0   ){
            
            
          }else{
            this.dialog.success(d['exist_coupon'].length+' Coupon Already Exist!');
            
          }
          
          
        }
        
        
        if(d['upload_count'] > 0   ){
          this.dialog.success(d['upload_count']+' Coupon Upload Successfully!');
          this.getAvailableCoupanList('');
          
        }
        
        
      }
      this.getAvailableCoupanList('');
      
      this.dialog.success( 'Coupon upload successfully!');
      
    },err => {
      //console.log(err); 
      this.formData = new FormData(); this.loading_list = false; 
    });
    
    
  }
  
  deleteCoupon(id) {
    this.dialog.delete('Coupon').then((result) => {
      if(result) {
        this.db.post_rqst({'id': id}, 'offer/removeCoupon')
        .subscribe(d => {
          //console.log(d);
          this.getAvailableCoupanList('');
          this.dialog.successfully();
        });
      }
    });
  } 
  
  
  assign_code_to_plumber(coupon){
    console.log("assign_code_to_plumber method calls");
    
    const dialogRef = this.alrt.open(ComplaintsNatureProblemComponent,{
      width: '500px',
      height:'500px',
      
      data: {
        'coupen_code' : coupon,
        'from' : 'coupon-code-list page',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result ){
        this.getAvailableCoupanList('');
      }
    });
    
    
    
  }
  
  
  view_dispatch_item_details(master_cart_id){
    console.log("view_dispatch_item_details method calls");
    const dialogRef = this.alrt.open(ComplaintsNatureProblemComponent, {
      maxWidth: '55vw', data: {
        'master_cart_id' : master_cart_id,
        'from' : 'coupon-code-list page'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    
  }
  
  get_secondary_or_master_coupon_list(type , action:any ){
    console.log("get_secondary_or_master_coupon_list method calls");
    console.log("type = "+type);
    
    console.log(this.available_secondary_qr_code_list);
    console.log(this.scanned_secondary_qr_code_list);
    console.log(this.available_master_qr_code_list);
    console.log(this.scanned_master_qr_code_list);
    
    if(action == 'refresh')
    {
      this.filter = {};
    }

    this.filter.date_to = this.filter.date_to  ? this.db.pickerFormat(this.filter.date_to) : '';
    this.filter.date_from = this.filter.date_from  ? this.db.pickerFormat(this.filter.date_from) : '';

    if( this.filter.date_from ||  this.filter.date_to)this.filtering = true;

    
    if(type == 'available_secondary'){
      this.loading_list = true;
      this.filter.date_created = this.filter.date_created  ? this.db.pickerFormat(this.filter.date_created) : '';
     


      
      this.db.post_rqst(  { 'filter': this.filter , 'login':this.db.datauser}, 'offer/secondaryCouponAvailableList?page=' + this.available_secondary_qr_code_list.current_page).subscribe(result => {      
        
        this.loading_list = false;
        console.log(result);
        this.available_secondary_qr_code_list = result['avialable_coupon']
        this.available_secondary_qr_code_coupon_count = result['avialable_coupon_count']
        
      });
      
    }
    else if(type == 'scanned_secondary'){
      this.loading_list = true;
      this.filter.date_created = this.filter.date_created  ? this.db.pickerFormat(this.filter.date_created) : '';
      this.filter.scanned_on = this.filter.scanned_on  ? this.db.pickerFormat(this.filter.scanned_on) : '';
      
      this.db.post_rqst(  { 'filter': this.filter, 'login':this.db.datauser }, 'offer/secondaryCouponScannedList?page=' + this.scanned_secondary_qr_code_list.current_page).subscribe(result => {      
        
        this.loading_list = false;
        console.log(result);
        this.scanned_secondary_qr_code_list = result['scanned_coupon']
        this.scanned_secondary_qr_code_coupon_count = result['scanned_coupon_count']
        
      });
      
    }
    else if(type == 'available_master'){
      this.loading_list = true;
      this.filter.date_created = this.filter.date_created  ? this.db.pickerFormat(this.filter.date_created) : '';
      this.db.post_rqst(  { 'filter': this.filter ,'login':this.db.datauser }, 'offer/masterBoxCouponAvailableList?page=' + this.available_master_qr_code_list.current_page).subscribe(result => {      
        
        this.loading_list = false;
        console.log(result);
        this.available_master_qr_code_list = result['avialable_coupon']
        this.available_master_qr_code_coupon_count = result['avialable_coupon_count']
        
      });
      
    }
    else if(type == 'scanned_master'){
      this.loading_list = true;
      this.filter.date_created = this.filter.date_created  ? this.db.pickerFormat(this.filter.date_created) : '';
      this.filter.dispatch_on = this.filter.dispatch_on  ? this.db.pickerFormat(this.filter.dispatch_on) : '';
      
      this.db.post_rqst(  { 'filter': this.filter, 'login':this.db.datauser }, 'offer/masterBoxCouponScannedList?page=' + this.scanned_master_qr_code_list.current_page).subscribe(result => {      
        
        
        this.loading_list = false;
        console.log(result);
        this.scanned_master_qr_code_list = result['scanned_coupon']
        this.scanned_master_qr_code_coupon_count = result['scanned_coupon_count']
        
      });
      
    }
    else{
      console.log("in else");
      this.dialog.error('Something Went Wrong. Please try again !');
    }
    
  }
  
  delete_secondary_or_master_available_coupon(id,type){
    console.log('delete_secondary_or_master_available_coupon method calls');
    console.log('type = '+ type);
    
    if(type == 'available_secondary'){
      this.dialog.delete('Coupon').then((result) => {
        if(result) {
          this.db.post_rqst({'id': id}, 'offer/deleteSecondarySingleCoupon').subscribe(d => {
            console.log(d);
            this.get_secondary_or_master_coupon_list(type , '' );
            this.dialog.successfully();
          });
        }
      });
      
    }
    
    else if(type == 'available_master'){
      this.dialog.delete('Coupon').then((result) => {
        if(result) {
          this.db.post_rqst({'id': id}, 'offer/deleteMasterBoxSingleCoupon').subscribe(d => {
            console.log(d);
            this.get_secondary_or_master_coupon_list(type , '' );
            this.dialog.successfully();
          });
        }
      });
      
    }
    else{
      
    }
    
  }
  
}
