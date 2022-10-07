import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDatepicker} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../../master//product-image-module/product-image-module.component';
import {ChangeKarigarStatusComponent} from '../../karigar/change-karigar-status/change-karigar-status.component';
import { KarigarBalanceModelComponent } from '../../karigar/karigar-balance-model/karigar-balance-model.component';
import * as moment from 'moment';
import {ChangeStatusComponent} from '../../gift-gallery/change-status/change-status.component';


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent implements OnInit {
  
  customer_id;
  loading_list = false;
  data:any={};
  filtering : any = false;
  filter:any = {};
  last_page: number ;
  current_page = 1;
  search: any = '';
  mindate :any = new Date();  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public dialog: DialogComponent, public alrt:MatDialog ) {}
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.customer_id = this.db.crypto(params['customer_id'],false);
        if (this.customer_id) {
          this.getCustomerDetails();
          this.data.type = 'Service'
          this.getComplaintsList(this.data.type);
        }
      });
    }
    
    toInt(i){
      return parseInt(i);
    }
    openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
    edit(){
      this.router.navigate(['/customer-edit/' +this.db.crypto(this.customer_id)]);
    }
    getData:any = {};
    getCustomerDetails() {
      this.loading_list = true;
      this.db.post_rqst(  {'customer_id':this.customer_id}, 'karigar/customerDetail')
      .subscribe(d => {
        this.loading_list = false;
        //console.log(d);
        this.getData = d.customer;
      });
    }
    karigarsSatus() {
      this.db.post_rqst({ 'status' : this.getData.status, 'id' : this.getData.id }, 'karigar/karigarStatus')
      .subscribe(d => {
        //console.log(d);
        this.getCustomerDetails();
      });
    }
    
    redirect_previous() {
      this.current_page--;
      this.getComplaintsList(this.data.type);
    }
    redirect_next() {
      if (this.current_page < this.last_page) { this.current_page++; }
      else { this.current_page = 1; }
      this.getComplaintsList(this.data.type);
    }
    
    complaints_count:any = 0;
    complaints:any=[];
    getComplaintsList(type) 
    {
      this.data.type = type
      this.loading_list = true;
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      if( this.filter.date )this.filtering = true;
      
      this.filter.customer_id = this.customer_id;
      this.db.post_rqst(  {  'filter': this.filter ,type:type }, 'karigar/complaintList?page=' + this.current_page)
      .subscribe( d => {
        this.loading_list = false;
        //console.log(d);
        
        this.current_page = d.karigars.current_page;
        this.last_page = d.karigars.last_page;
        this.complaints = d.karigars.data;
        this.complaints_count = d.karigars.total;
      });
    }
    
    step = 1;
    setStep(index: number) {
      this.step = index;
    }
    nextStep() {
      this.step++;
    }
    prevStep() {
      this.step--;
    }
    openDialog(id ,string ) {
      const dialogRef = this.alrt.open(ProductImageModuleComponent,
        {
          // width: '500px',
          // height:'500px',
          data: {
            'id' : id,
            'mode' : string,
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log(`Dialog result: ${result}`);
        });
      }
    }
    