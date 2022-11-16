import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-sale-team-detail',
  templateUrl: './sale-team-detail.component.html',
  styleUrls: ['./sale-team-detail.component.scss']
})
export class SaleTeamDetailComponent implements OnInit {
  getData:any={};
  sale_user_id:any;
  tabChange:any='Contractor';
  loading_list:boolean=false
  constructor(public db:DatabaseService, public route:ActivatedRoute,public router:Router ) { 
    
    this.route.params.subscribe(params=>{
      this.sale_user_id=this.db.crypto(params['id'],false);
      console.log(this.sale_user_id);
    })
    this.getSaleUserDetail();

  }

  ngOnInit() {
  }

  getSaleUserDetail(){
    this.loading_list=true;
    this.db.post_rqst({'id':this.sale_user_id},'karigar/salesUserDetail').subscribe((res)=>{
      console.log(res);
      this.loading_list=false;
      this.getData=res['sales_users_data'];
    },err=>{
      this.loading_list=false;
    })


  }

}
