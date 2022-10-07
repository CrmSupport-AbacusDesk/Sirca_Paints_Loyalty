import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-complaints-nature-problem',
  templateUrl: './complaints-nature-problem.component.html',
})
export class ComplaintsNatureProblemComponent implements OnInit {
  data: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  complaint:any = {};
  from:any = 'nature_problem'
  selected_plumber:any='0';
  master_search:any = '';
  plumber_list : any = [];
  datauser: any = {};
  plumber_meet_plumbers_list:any = [];
  dispatch_item_data_of_masterQR:any = [];

  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,@Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ComplaintsNatureProblemComponent>) {
    console.log(model_data);
    console.log(this.model_data.id);
    console.log(this.model_data.from);
    console.log(model_data.from)
    console.log(model_data.id);
    
    
    
    if(this.model_data.from == 'coupon-code-list page' && this.model_data.coupen_code){
      this.datauser = JSON.parse(localStorage.getItem('users'))
      console.log(this.datauser);
      this.get_verified_plumbers();
      console.log(this.model_data);
      console.log('data comes from coupon-code-list page');
      this.from = this.model_data.from;
      
    }
    
    if(this.model_data.from == 'plumber_meet_list_page' && this.model_data.id){
      this.datauser = JSON.parse(localStorage.getItem('users'))
      console.log(this.datauser);
      console.log(this.model_data);
      console.log('data comes from plumber_meet_list_page');
      this.from = this.model_data.from;
      this.get_plumber_meet_plumbers_data();
      
    }

    if(this.model_data.from == 'coupon-code-list page' && this.model_data.master_cart_id){
      this.datauser = JSON.parse(localStorage.getItem('users'))
      console.log(this.datauser);
      console.log(this.model_data);
      console.log('data comes from master-coupon-code-list page');
      this.from = 'coupon-code-list page for view master';
      this.get_dispatch_item_data_of_masterQR();
      
    }
    
    else{
      this.data.id = model_data.id; 
      this.data.nature_problem = model_data.nature_problem; 
    }
    
    
    
    
    
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gift_id = params['gift_id'];
      this.complaint.nature_problem = this.data.nature_problem; 
      console.log( "this.complaint ");
      
    });
  }
  
  addCompalintStatus(form:any)
  {
    this.savingData = true;
    this.complaint.created_by = this.db.datauser.id;
    
    this.db.post_rqst( { 'status' : this.complaint ,'id': this.data.id }, 'karigar/updateNatureProblem')
    .subscribe( d => {
      this.savingData = false;
      this.dialog.success( 'Status successfully Change');
      this.dialogRef.close(true);
      //console.log( d );
    });
  }
  
  onNoClick(): void{
    this.dialogRef.close();
  }
  
  get_verified_plumbers(){
    console.log("get_verified_plumbers method calls");
    console.log(this.master_search);
    this.db.post_rqst( {'master':this.master_search}, 'karigar/verified_plumber_list').subscribe( result => {
      console.log( result );
      this.plumber_list = result['verified_plumber_list']
      console.log(this.plumber_list.length);
      console.log(this.plumber_list);
      
    });
    
  }
  
  assign_coupon_to_plumber(){
    console.log("assign_coupon_to_plumber method calls");
    console.log(this.selected_plumber);
    this.db.post_rqst( {'qr_code':this.model_data.coupen_code,'karigar_id':this.selected_plumber,'assign_coupon_by':this.datauser['id']}, 'karigar/karigarCoupon').subscribe( result => {
      console.log( result );
      this.dialog.success( 'Coupon Successfully Assign');
      this.dialogRef.close(true);
      
    });
    
  }
  
  get_plumber_meet_plumbers_data(){
    console.log("get_plumber_meet_plumbers_data method calls");
    console.log(this.master_search);
    this.db.post_rqst( {'plumber_meet_id':this.model_data.id}, 'karigar/plumber_meet_detail').subscribe( result => {
      console.log( result );
      this.plumber_meet_plumbers_list = result['participent_list']
      
    });
    
  }
  
  get_dispatch_item_data_of_masterQR(){
    console.log("get_dispatch_item_data_of_masterQR method calls");
    this.db.post_rqst( {'id':this.model_data.master_cart_id}, 'offer/masterBoxCouponScannedDetail').subscribe( result => {
      console.log( result );
      this.dispatch_item_data_of_masterQR = result['secondary_box_detail_list']
    });
    
  }
  
}
