import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-coupon-code-data-detail',
  templateUrl: './coupon-code-data-detail.component.html',
  styleUrls: ['./coupon-code-data-detail.component.scss']
})
export class CouponCodeDataDetailComponent implements OnInit {

  value:any='Techiediaries';
  getData:any={};
  coupon_id:any='';
  loading_list:boolean=false;
  constructor(private route: ActivatedRoute,public db:DatabaseService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      
      this.coupon_id = params['id'];
      
      console.log(this.coupon_id);
      
      // this.page_number = params['page'];
      // this.status = params['status'];
      if (this.coupon_id) {
        this.getCouponDetails();
        // this.getSiteDetails();
      }
    });
  }


  getCouponDetails(){
    this.loading_list=true;
    this.db.post_rqst({'id':this.coupon_id},'offer/qrCodeDetail').subscribe((result)=>{
      console.log(result)
    this.loading_list=false;
    this.getData=result['qr_code_detail'];      

    },err=>{
    this.loading_list=false;
      
    });

  }

}
