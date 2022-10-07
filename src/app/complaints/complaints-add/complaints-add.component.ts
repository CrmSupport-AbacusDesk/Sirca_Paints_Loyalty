import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { MatDialog, MatDatepicker} from '@angular/material';


@Component({
  selector: 'app-complaints-add',
  templateUrl: './complaints-add.component.html',
})
export class ComplaintsAddComponent implements OnInit {
  
  loading_list = false;
  complaintfrom: any = {};
  savingData = false;
  states: any = [];
  districts: any = [];
  cities: any = [];
  pincodes: any = [];
  complaints_id:any;
  date1:any;
  mobile:any = {}
  data:any={};
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) { this.date1 = new Date();
    
    
    }
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.complaints_id =  this.db.crypto(params['complaints_id'],false);
        ////console.log(this.complaints_id );
        this.data.type = params.type;
        if (this.complaints_id) {
          this.getComplaintsDetails();
          this.getStateList();
        }
        this.getStateList();
        this.complaintfrom.country_id = 99;
      });
    }
    
    openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
    
    getData:any = {};
    getComplaintsDetails() {
      this.loading_list = true;
      this.db.post_rqst(  {'complaints_id':this.complaints_id}, 'karigar/complaintDetailById')
      .subscribe(d => {
        this.loading_list = false;
        ////console.log(d);
        this.complaintfrom = d.complaints;
        ////console.log( this.complaintfrom);
        this. getStateList();
        this.getDistrictList(1);
        this.getCityList(1);
        this.AssignSaleUser();
      });
    }
    getStateList(){
      this.loading_list = true;
      this.db.get_rqst('', 'app_master/getStates')
      .subscribe(d => {  
        this.loading_list = false;  
        this.states = d.states;
        
      });
    }
    getDistrictList(val){
      this.loading_list = true;
      let st_name;
      if(val == 1)
      {
        st_name = this.complaintfrom.state;
      }
      this.db.post_rqst({'state_name':st_name}, 'app_master/getDistrict')
      .subscribe(d => {  
        this.loading_list = false;
        this.districts = d.districts;  
        
      });
      this.AssignSaleUser();
    }

    pincodeBlank()
    {
      this.complaintfrom.pincode = '';
    }
    getCityList(val){   
      this.loading_list = true;
      let dist_name;
      if(val == 1)
      {
        dist_name = this.complaintfrom.district;
      }
      this.db.post_rqst({'district_name':dist_name}, 'app_master/getCity')
      .subscribe(d => {  
        this.loading_list = false;
        this.cities = d.cities;
        this.pincode = d.pins;
      });
      
    }
    pincode:any = [];
    getPincodeList(val){   
      this.loading_list = true;
      let pincode_name;
      if(val == 1)
      {
        pincode_name = this.complaintfrom.pincode;
      }
      this.db.post_rqst({'city_name':pincode_name}, 'app_master/getPincodes')
      .subscribe(d => {  
        this.loading_list = false;
        this.pincode = d.pins;
      });
    }
    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
    
    sales_users:any=[];
    AssignSaleUser()
    {
      this.loading_list = true;
      this.db.post_rqst(  {'state':this.complaintfrom.state}, 'karigar/addComplaintPlumber')
      .subscribe(d => {
        this.loading_list = false;
        this.sales_users = d.plumber_list;
      });
    }
    
    clear(){
      this.status='';
      this.customer={};
      this.customer_id = '';
      this.complaintfrom.first_name = '';
      this.complaintfrom.address = '';
      this.complaintfrom.state = '';
      this.complaintfrom.city = '';    
      this.complaintfrom.pincode = '';   
      this.districts=[];
      this.complaintfrom.district = '';
      
    }
    
    
    customer:any={};
    customer_id:any = {};
    status:any = '';
    complaintsExit:any = '';
    AssignCustomer()
    {
      this.savingData = true;
      
      
      
      if(this.complaintfrom.mobile_no.length == 10)
      {
        this.db.post_rqst(  {'mobile_no' : this.complaintfrom.mobile_no }, 'karigar/checkCustomerNumExits')
        .subscribe(d => {
          console.log(d);
          this.savingData = false;
          
          
          
          if(d.status == 'FOUND' ){
            
            if(d.customerDetail.type == 'Plumber' ){
              this.dialog.warning('This Mobile No. alresdy exist in Plumber!');
              this.status = '';
              return;
            }
            
            if(d.complaintExist)
            {
              this.router.navigate(['complaints-detail/'+ this.db.crypto(d.complaintDetail.id)]);
              this.dialog.warning('Complaint Already Pending!');
              return;
            }
            this.customer = d.customerDetail;
            this.customer_id = this.customer.id;
            this.complaintfrom.first_name = this.customer.first_name;
            this.complaintfrom.address = this.customer.address;
            this.complaintfrom.state = this.customer.state;
            this.complaintfrom.city = this.customer.city;    
            this.complaintfrom.pincode = this.customer.pincode;   
            
            this.getDistrictList(1);
            this.complaintfrom.district = this.customer.district;
            
          }else{
            this.dialog.warning('This Customer Mobile No. Not Found');
          }
          
          this.status = d.status;
          
          
        });
      }
      // else if(this.complaintfrom.mobile_no.length  10){
      //   this.complaintfrom.reset();
      // }
      
    }
    
    selectSales(){
      this.complaintfrom.sales_mobile = this.sales_users.filter( x => x.id  === this.complaintfrom.sales_name )[0].mobile_no;
      this.complaintfrom.sales_id = this.sales_users.filter( x => x.id  === this.complaintfrom.sales_name )[0].id;
    }
    
    selectedFile: File[]=[];
    type:any = {};
    media:any=[];
    
    fileChange(event) {
      
      console.log(event.target.files);
      for (var i = 0; i < event.target.files.length; i++) {
        this.selectedFile.push(event.target.files[i]);
        var type = event.target.files[i].type;
        var name = event.target.files[i].name;


        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]); // read file as data url
  
        reader.onload = (e) => { // called once readAsDataURL is completed
          console.log(e);
          console.log(e);
           this.media.push({file : reader.result, type : type.substr(0,5) , name : name})
          // this.des.push(event.target.result);
        }

console.log( this.media );




        
      }
      console.log(this.selectedFile);
    }
    
    urls = new Array<string>();
    
    
    formData = new FormData();
    
    
    i:any = 0;
    
    savecomplaintfrom(form:any) {
      
      if(this.selectedFile.length > 0) {
        
        for (let f of this.selectedFile)
        {
          // this.formData.append(this.i, f, f.name);
          this.formData.append('images'+this.i,  f , f.name);
          
          this.i++;
        }
      }
      
      
      
      this.loading_list = true;
      this.savingData = true;
      this.complaintfrom.created_by = this.db.datauser.id;
      this.complaintfrom.assigned_plumber  = this.complaintfrom.sales_id ? this.complaintfrom.sales_id : '';
      this.complaintfrom.type = this.data.type
      console.log(this.complaintfrom);
      
      for (var property1 in this.complaintfrom)
      {
        console.log(property1);
        this.formData.append('complaint['+property1+']',this.complaintfrom[property1]);
      }
      // this.complaintfrom.customer_id = this.customer_id.id ? this.customer_id.id : ''; 
      if( this.customer == null)
      {
        this.complaintfrom.customer_id = '';
      }
      else{
        this.complaintfrom.customer_id = this.customer.id;
      }
      
      console.log(this.formData);
      this.formData.append('type',this.data.type)
      console.log(this.formData);
      this.db.fileData( this.formData  , 'app_karigar/addComplaintWeb')
      .subscribe( d => {
        this.router.navigate(['complaints-list/service']);
        this.dialog.success( 'Complaints has been successfully added');
        this.savingData = false;
        this.loading_list = false;
      });
    }
    
    deleteProductImage(index)
    {
      //console.log(index);
      this.selectedFile.splice(index,1)
      this.media.splice(index,1)
    }
    
  }
  