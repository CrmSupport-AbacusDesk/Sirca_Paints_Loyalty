import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-scheme-detail',
  templateUrl: './scheme-detail.component.html',
  styleUrls: ['./scheme-detail.component.scss']
})
export class SchemeDetailComponent implements OnInit {

  getData:any={};
  id:any;
  loading_list:boolean=false;
  tabChange:any='Contractor';
  constructor(public route:ActivatedRoute , public db:DatabaseService ,public router:Router ) { }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
        console.log(params);
      this.id=params['id'];
      console.log(this.id);

    });
    if(this.id){
      this.schemeDetail();
    }
  }

  edit(){
    this.router.navigate(['/schemeAdd/' +this.id]);
  }

  schemeDetail(){
    this.loading_list=true;
    this.db.post_rqst({'id':this.id},'offer/schemeDetail').subscribe((res)=>{
      console.log(res);
      this.loading_list=false;
      this.getData=res['schemeDetail'];

    },err=>{
      this.loading_list=false;
    })



  }

}
