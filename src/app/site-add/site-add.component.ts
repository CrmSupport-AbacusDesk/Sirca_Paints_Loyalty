import { Component, OnInit } from '@angular/core';
import { MatDatepicker, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { SessionStorage } from 'src/app/_services/SessionService';

@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.scss']
})
export class SiteAddComponent implements OnInit {
  
  loading_list = false;
  siteform: any = {};
  savingData = false;
  states:any =[];
  districts: any = [];
  citys: any = [];
  filter:any = {};
  salesUser:any =[];
  pc:any=[];
  pincodes: any = [];
  karigar_id:any;
  image = new FormData();
  date1:any;
  zoneData:any =[];
  managerData:any =[];
  uploadurl: any = "";
  dealers:any = [];
  sales_person:any = [];
  salesuser_id:any = [];
  loginId:any;
  loginName:any;
  
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,public matDialog: MatDialog,  public dialog: DialogComponent,public session:SessionStorage ) { 
    this.uploadurl = this.db.uploadUrl;
   
    this.date1 = new Date();
    console.log(this.session.users);
    this.loginId=this.session.users.id;
    this.loginName=this.session.users.username;
  }
  
  ngOnInit() {
    
    // this.managerList('');
    this.getBrand('');
    this.route.params.subscribe(params => {
      this.karigar_id = params['id'];
      if (this.karigar_id)
      {
        this.getKarigarDetails();
      }
      // this.managerList('');
      this.getStateList();
      // this.get_karigar_type();
      this.getPc('');
      this.getSalesExecutive('');
      this.siteform.country_id = 99;
    });
  }
  
  
  selectedExecutive = (event, i) => {
    console.log(event.source.value, i);
    if(event.source.selected) {
      this.salesuser_id.push({'id':event.source.value});
    }else {
      console.log('unchecked called');
      const index = this.salesuser_id.findIndex(row => row.id == event.source.value);
      this.salesuser_id.splice(index, 1);
    }
    console.log(event);
    console.log(this.salesuser_id);
  }

  checkId = (event) => {
    console.log('Checked Called =', event);
  }


  getStateList(){
    this.loading_list = true;
    this.db.get_rqst({}, 'app_master/getStates')
    .subscribe(d => { 
      
      
      this.loading_list = false;  
      this.states = d['states'];
    },error=>{
      this.loading_list=false;
    });
  }
  
  getDistrictList(value){
    this.loading_list = true;
    let st_name;
    if(value == 1)
    {
      st_name = this.siteform.state;
    }
    this.db.post_rqst({'state_name':st_name}, 'app_master/getDistrict')
    .subscribe(d => { 
      
      this.loading_list = false;  
      this.districts = d.districts;
    },error=>{
      this.loading_list=false;
    });
  }
  
  getCityList(value){
    let dist_name;
    if(value == 1)
    {
      dist_name = this.siteform.district;
    }
    
    this.db.post_rqst({'district_name':dist_name}, 'app_master/getCity')
    .subscribe(d => { 
      
      this.loading_list = false;  
      this.citys = d.cities;
    },error=>{
      this.loading_list=false;
    });
  }

  brandData:any =[]
  getBrand(event){
    this.db.post_rqst({'search':event}, 'app_master/getBrandsForSites')
    .subscribe(d => { 
      console.log(d);
      
      // this.loading_list = false;  
      this.brandData = d.brands;
      console.log(this.brandData);
      
    },error=>{
      this.loading_list=false;
    });
  }
  

  getSalesExecutive = (zone) => {
    this.filter.assigned_location = zone;
    this.db.post_rqst({'filter':this.filter}, 'karigar/salesUsersList')
    .subscribe(d => { 
      this.sales_person = d.sales_users.data;

      console.log('result sales excutive', d.sales_executives);
      // this.siteform.sales_zone = d.locationZones.zone;
      // this.getDelaer(this.siteform.sales_zone);
      
    });

    if(this.karigar_id > 0) {
      this.selectAll();
    }
  }

  selectAll = () => {
      const data = this.salesuser_id.filter(row => row.id == this.siteform.salesuser_id);
      console.log('Selected Data ==>', this.siteform.salesuser_id);

      for(let i = 0; i < this.siteform.salesuser_id.length; i++){
            // this.salesuser_id[i].selected = true; 
      }
      console.log('Inside IF ELSE Condition ==>', this.siteform);
  }


  getZoneList(city){
    
    let city_name;
    if(city == 1)
    {
      city_name = this.siteform.city;
      this.db.post_rqst({'city_name':city_name}, 'master/getLocationZones')
      .subscribe(d => { 
        console.log(d);
        this.siteform.sales_zone = d.locationZones.zone;
        if(this.siteform.sales_zone != '') {
          this.getSalesExecutive(d.locationZones.zone);
        }
        this.getDelaer(this.siteform.sales_zone, '');
      },error=>{
        this.loading_list=false;
      });
    }
    
    
  }
  
  getPc(search){
    let filter={};
    filter={
        mode:0
    };
    this.db.post_rqst({'filter':filter}, 'karigar/contractorList')
    .subscribe(d => { 
      console.log(d);
      this.pc = d.contractorData['data'];
    },error=>{
      this.loading_list=false;
    });
  }
  
  getDelaer(search_zone, search){
    this.db.post_rqst({'sales_zone':search_zone, 'search':search}, 'master/getDealers')
    .subscribe(d => { 
      console.log(d);
      this.dealers = d.dealers;
    },error=>{
      this.loading_list=false;
    });
  }

  // getSalesUser(search){
  //   this.filter.assigned_location = this.siteform.sales_zone;
  //   this.db.post_rqst({'filter':this.filter, 'search':search}, 'karigar/getSalesExecutives')
  //   .subscribe(d => { 
  //     console.log(d);
      
  //     this.loading_list = false;  
  //     this.salesUser = d.sales_executives;
  //   });
  // }
  
  
  
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }
  
  
  getKarigarDetails() {
    this.loading_list = true;
    this.db.post_rqst(  {'site_location_id':this.karigar_id}, 'master/siteLocationDetail')
    .subscribe(d => {
      this.loading_list = false;
      console.log(d);
      this.siteform = d.site_locations;
      if(this.siteform.sales_zone  != ''){
        this.getDelaer(this.siteform.sales_zone, '')
      }

      this.siteform.salesuser_id = this.siteform.assign_to;
      this.siteform.dealer_id = this.siteform.dealer_id;
      console.log(this.siteform.images);
      
      this.getDistrictList(1);
      this.getCityList(1);
      this.getSalesExecutive(d.site_locations.sales_zone);
      // this.getSalesUser('');
      
      for(let i=0; i<this.siteform.image.length ;i++)
      {
        // if( parseInt( this.siteform.images[i].profile ) == 1  )
        this.selected_image.push({"image":this.siteform.image[i].image_name,"id":this.siteform.image[i].id} );
      }
      
    },error=>{
      this.loading_list=false;
    });
  }
  
  
  managerList(searcValue){
    // this.loading_list = true;
    this.db.post_rqst({'search':searcValue}, 'karigar/getManagers')
    .subscribe(d => { 
      console.log(d);
      
      this.loading_list = false;  
      this.managerData = d.managers;
    },error=>{
      this.loading_list=false;
    });
  }
  
  
  
  type_list = [];
  get_karigar_type()
  {
    this.db.post_rqst({},"karigar/get_kar_type")
    .subscribe(resp=>{
      console.log(resp);
      this.type_list = resp.types;
    },error=>{
      this.loading_list=false;
    })
  }
  
  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  
  selected_image :any = [];
  onUploadChange(data: any)
  {
    for(let i=0;i<data.target.files.length;i++)
    {
      let files = data.target.files[i];
      if (files) 
      {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image.push({"image":e.target.result});
        }
        reader.readAsDataURL(files);
      }
      this.image.append(""+i,data.target.files[i],data.target.files[i].name);
    }
  }
  
  
  deleteProductImage(index,data)
  {
    console.log(data);
    
    this.dialog.delete("Are you sure ?")
    .then(resp=>{
      console.log(resp);
      if(resp)
      {
        this.db.post_rqst({"id":data},"master/deleteSiteLocationImage")
        .subscribe(resp=>{
          console.log(resp);
          this.dialog.success("Deleted!");
          this.selected_image.splice(index,1)
        },error=>{
          this.loading_list=false;
        });
      }
    })
  }
  
  removeImage() {
    this.selected_image = [];
  }
  
  
  savesiteform(form:any)
  {
    this.savingData = true;
    this.loading_list = true;
    this.siteform.salesuser_id = this.salesuser_id;
    this.siteform.loginId = this.loginId;
    this.siteform.loginName = this.loginName;
    this.siteform.dob = this.siteform.dob  ? this.db.pickerFormat(this.siteform.dob) : '';
    this.siteform.created_by = this.db.datauser.id;
    if(this.karigar_id)
    {
      this.siteform.site_location_id  = this.karigar_id;
    }
    else
    {
      // this.siteform.karigar_type = 3;
    }
    
    this.siteform.image = this.selected_image ? this.selected_image : [];
    
    this.db.post_rqst( { 'data' : this.siteform }, 'master/siteLocationAdd')
    .subscribe( d => {
      this.savingData = false;
      this.loading_list = false;
      if(d['status'] == 'SUCCESS' ){
        this.router.navigate(['site-list/1']);
        this.dialog.success('Site has been successfully added');
      }
      else if(d['status']  == 'UPDATED'){
        this.router.navigate(['site-list/1']);
        this.dialog.success('Site has been successfully updated');
      }
      // this.db.fileData(this.image, "images").subscribe((resp) => {
      //   console.log(resp);
      //   this.savingData = false;
      //   this.image = new FormData();
      //   this.siteform = {};
      //   this.selected_image = [];
      
      // });
      
    },error=>{
      this.loading_list=false;
    });
  }
  
}
