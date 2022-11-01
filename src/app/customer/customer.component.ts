import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../_services/DatabaseService';
import {DialogComponent} from '../dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit {
  
  loading_list = false;
  karigars: any = [];
  total_karigars = 0;
  karigar_all:any =0;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  filter:any = {};
  filtering : any = false;
  
  karigar_pending : any = 0;
  karigar_reject : any = 0;
  karigar_suspect : any = 0;
  karigar_verified : any = 0;
  
  constructor(public db: DatabaseService, public dialog: DialogComponent, public router:Router, ) {}
  
  ngOnInit() {
    this.filter.status = '';
    this.getCustomerList(); 
    this.AssignSaleUser();
  }

  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }
  redirect_previous() {
    this.current_page--;
    this.getCustomerList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getCustomerList();
  }
  
  getCustomerList() 
  {
    //console.log(this.filter);
    this.loading_list = true;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    if( this.filter.date)this.filtering = true;
    this.filter.mode = 0;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'karigar/architectList?page=' + this.current_page)
    .subscribe( d => {
      this.loading_list = false;
      console.log(d['architectData']['data']);
      
      this.current_page = d['architectData'].current_page;
      this.last_page = d['architectData'].last_page;
      this.total_karigars =d['architectData'].total;
      this.karigars = d['architectData']['data'];
      
      this.karigar_all = d.karigar_all;
      // this.karigar_pending = d.karigar_pending;
      // this.karigar_reject = d.karigar_reject;
      // this.karigar_suspect = d.karigar_suspect;
      // this.karigar_verified = d.karigar_verified;
    });
  }

  exportCustomer()
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'karigar/exportCustomer')
    .subscribe( d => {
      document.location.href = this.db.myurl+'/app/uploads/exports/Customer.csv';
      //console.log(d);
    });
  }

    
  sales_users:any=[];
  AssignSaleUser()
  {
    // this.loading_list = true;
    this.db.get_rqst(  '', 'karigar/sales_users')
    .subscribe(d => {
      // this.loading_list = false;
      //console.log(d);
      this.sales_users = d.sales_users;
    });
  }
  getDealer:any=[];
  dealer()
  {
    this.loading_list = true;
    this.db.get_rqst(  '', 'karigar/dealer_contact_person')
    .subscribe(d => {
      this.loading_list = false;
      //console.log(d);
      this.getDealer = d.dealer_contact_person;
    });
  }
  
    
  karigarsSatus(i) {
    this.db.post_rqst({ 'status' : this.karigars[i].status, 'id' : this.karigars[i].id }, 'karigar/karigarStatus')
    .subscribe(d => {
      //console.log(d);
      this.getCustomerList();
    });
  }

  deleteCustomer(id) {
    this.dialog.delete('Karigar').then((result) => {
      if(result) {
    this.db.post_rqst({'id': id}, 'karigar/remove')
    .subscribe(d => {
      //console.log(d);
      this.getCustomerList();
      this.dialog.successfully();
    });
  }
    });
  } 

  karigarAdd(){
    this.router.navigate(['karigar-add' ,{'registration_type':'Architect'}])
}


}

