import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import {MatPaginator, MatTableDataSource, MatDialog, MatDatepicker} from '@angular/material';


@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
})
export class CustomerEditComponent implements OnInit {
  
  loading_list = false;
  customerform: any = {};
  savingData = false;
  states: any = [];
  districts: any = [];
  cities: any = [];
  pincodes: any = [];
  customer_id:any;
  date1:any;
  
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) { this.date1 = new Date();}
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.customer_id = this.db.crypto(params['customer_id'],false);
        //console.log(this.customer_id );
        
        if (this.customer_id) {
          this.getKarigarDetails();
          this.getStateList();
        }
        this.getStateList();
        this.customerform.country_id = 99;
      });
    }
    
    openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
    
    getData:any = {};
    getKarigarDetails() {
      this.loading_list = true;
      this.db.post_rqst(  {'karigar_id':this.customer_id}, 'karigar/karigarDetail')
      .subscribe(d => {
        this.loading_list = false;
        console.log(d);
        this.customerform = d.karigar;
        console.log( this.customerform);
        this.getStateList();
        this.getDistrictList(1);
        this.getCityList(1);
      });
    }
    getStateList(){
      this.loading_list = false;
      this.db.get_rqst('', 'app_master/getStates')
      .subscribe(d => {  
        this.loading_list = true;  
        this.states = d.states;
      });
    }
    getDistrictList(val){
      this.loading_list = false;
      let st_name;
      if(val == 1)
      {
        st_name = this.customerform.state;
      }
      this.db.post_rqst({'state_name':st_name}, 'app_master/getDistrict')
      .subscribe(d => {  
        this.loading_list = true;
        this.districts = d.districts;  
      });
    }
    getCityList(val){   
      this.loading_list = false;
      let dist_name;
      if(val == 1)
      {
        dist_name = this.customerform.district;
      }
      this.db.post_rqst({'district_name':dist_name}, 'app_master/getCity')
      .subscribe(d => {  
        this.loading_list = true;
        this.cities = d.cities;
        this.pincode = d.pins;
      });
    }
    pincode:any = [];
    getPincodeList(val){   
      this.loading_list = false;
      let pincode_name;
      if(val == 1)
      {
        pincode_name = this.customerform.pincode;
      }
      this.db.post_rqst({'city_name':pincode_name}, 'app_master/getPincodes')
      .subscribe(d => {  
        this.loading_list = true;
        this.pincode = d.pins;
      });
    }

    pincodeBlank()
    {
      this.customerform.pincode = '';
    }

    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    savecustomerform(form:any) {
      this.savingData = true;
      
     
     
       // if(!this.customerform.first_name){
      //   this.dialog.warning('Plumber name');
      //   return;
      // }
      
      this.customerform.created_by = this.db.datauser.id;
      this.customerform.customer_edit_id = this.customer_id;
      this.customerform.type = "Customer";
      
      this.db.insert_rqst( { 'customer' : this.customerform }, 'karigar/customerEdit')
      .subscribe( d => {
        this.savingData = false;
        //console.log( d );
        if(d['status'] == 'EXIST' ){
          this.dialog.error( 'Mobile No. already exists');
          return;
        }
        this.router.navigate(['/customer-detail/'+this.db.crypto(this.customer_id)]);
        this.dialog.success( 'Customer has been successfully updated');
      });
    }
   
  }
  