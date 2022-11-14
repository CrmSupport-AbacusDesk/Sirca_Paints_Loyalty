import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import {MatPaginator, MatTableDataSource, MatDialog, MatDatepicker} from '@angular/material';


@Component({
    selector: 'app-karigar-add',
    templateUrl: './karigar-add.component.html',
})
export class KarigarAddComponent implements OnInit {
    
    loading_list = false;
    karigarform: any = {};
    savingData = false;
    states: any = [];
    per_states: any = [];
    districts: any = [];
    per_districts: any = [];
    cities: any = [];
    pincodes: any = [];
    karigar_id:any;
    date1:any;
    media:any=[];
    media2:any=[];
    media3:any=[];
    selectedFile: File[]=[];
    selectedFile2: File[]=[];
    selectedFile3: File[]=[];
    contractorList:any=[];
    
    constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
        public matDialog: MatDialog,  public dialog: DialogComponent) { this.date1 = new Date();}
        
        ngOnInit() {
            this.route.params.subscribe(params => {
                this.karigarform.registrationType=params.registration_type;
                console.log( this.karigarform.registrationType);

                this.karigar_id = this.db.crypto(params['karigar_id'],false);
                //console.log(this.karigar_id );
                
                if (this.karigar_id) {
                    this.getKarigarDetails();
                    this.getStateList();
                this.getContractorList();

                }
                this.getStateList();
                this.AssignSaleUser();
                this.getContractorList();
                this.karigarform.country_id = 99;
            });
        }
        
        openDatePicker(picker : MatDatepicker<Date>)
        {
            picker.open();
        }
        
        getData:any = {};
        getKarigarDetails() {
            this.loading_list = true;
            this.db.post_rqst(  {'karigar_id':this.karigar_id}, 'karigar/karigarDetail')
            .subscribe(d => {
                this.loading_list = false;
                //console.log(d);
                this.karigarform = d.karigar;
                this.karigarform.registrationType=this.karigarform.type
                //console.log( this.karigarform);
                this. getStateList();
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
                this.per_states = d.states;
            });
        }
        
        
        getDistrictList(val){
            this.loading_list = false;
            let st_name;
            if(val == 1)
            {
                st_name = this.karigarform.state;
            }
            this.db.post_rqst({'state_name':st_name}, 'app_master/getDistrict')
            .subscribe(d => {  
                this.loading_list = true;
                this.districts = d.districts;  
            });
        }
        
        getPerDistrictList(val){
            this.loading_list = false;
            let st_name;
            if(val == 1)
            {
                st_name = this.karigarform.state;
            }
            this.db.post_rqst({'state_name':st_name}, 'app_master/getDistrict')
            .subscribe(d => {  
                this.loading_list = true;
                this.per_districts = d.districts;  
            });
        }
        
        getCityList(val){   
            this.loading_list = false;
            let dist_name;
            if(val == 1)
            {
                dist_name = this.karigarform.district;
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
                pincode_name = this.karigarform.pincode;
            }
            this.db.post_rqst({'city_name':pincode_name}, 'app_master/getPincodes')
            .subscribe(d => {  
                this.loading_list = true;
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
        savekarigarform(form:any) {
            this.savingData = true;
            
            this.karigarform.dob=this.karigarform.dob  ? this.db.pickerFormat(this.karigarform.dob) : '';
            this.karigarform.created_by=this.db.datauser.id;
            // this.karigarform.created_name=this.db.datauser.username;
            this.karigarform.karigar_edit_id =  this.karigar_id  ?  this.karigar_id  : '';
            this.karigarform.type = "Plumber";
            this.karigarform.status = "Pending";
            
            this.db.insert_rqst( { 'karigar' : this.karigarform , 'adhar_image':this.media,'pan_card_image':this.media2,'cancel_check_image':this.media3 }, 'app_karigar/addKarigarWeb')
            .subscribe( d => {
                this.savingData = false;
                //console.log( d );
                if(d['status'] == 'EXIST' ){
                    this.dialog.error( 'Mobile No. already exists');
                    return;
                }
                if(d['status']=='SUCCESS'){
                    if(d['type']=='Contractor'){
                        this.router.navigate(['contractor-list']);
                        this.dialog.success( 'Contractor successfully added');
                    }
                    if(d['type']=='Architect'){
                        this.router.navigate(['architect-list']);
                        this.dialog.success( 'Architect successfully added');
                    }

                }
            });
        }
        sales_users:any=[];
        AssignSaleUser()
        {
            this.loading_list = false;
            this.db.get_rqst(  '', 'karigar/sales_users')
            .subscribe(d => {
                this.loading_list = true;
                this.sales_users = d.sales_users;
            });
        }
        documentChange()
        {
            this.karigarform.document_no='';
        }
        onUploadChange(evt: any) {
            const file = evt.target.files[0];
            //console.log(file);
            if (file) {
                const reader = new FileReader();
                reader.onload = this.handleReaderLoaded.bind(this);
                reader.readAsBinaryString(file);
            }
        }
        handleReaderLoaded(e) {
            this.karigarform.document_image = 'data:image/png;base64,' + btoa(e.target.result) ;
            //console.log( this.karigarform.document_image );
        }
        selectSales(){
            this.karigarform.sales_mobile = this.sales_users.filter( x => x.id  === this.karigarform.sales_user )[0].phone;
        }
        
        
        sameAsSameAddress(event) {       
            
            console.log(event);
            
            if (event.checked) {
                
                this.karigarform.permanent_address = this.karigarform.address;
                this.karigarform.permanent_state = this.karigarform.state;
                this.karigarform.parmanent_district = this.karigarform.district;
                this.karigarform.permanent_city = this.karigarform.city;
                this.karigarform.permanent_pincode = this.karigarform.pincode;
                
            } else {
                
                this.karigarform.permanent_address = '';
                this.karigarform.permanent_state = '';
                this.karigarform.parmanent_district = '';
                this.karigarform.permanent_city = '';
                this.karigarform.permanent_pincode = '';
            }
        }

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

        deleteProductImage(index)
        {
          //console.log(index);
          this.selectedFile.splice(index,1)
          this.media.splice(index,1)
        }


        fileChange2(event) {
      
            console.log(event.target.files);
            for (var i = 0; i < event.target.files.length; i++) {
              this.selectedFile2.push(event.target.files[i]);
              var type = event.target.files[i].type;
              var name = event.target.files[i].name;
      
      
              var reader = new FileReader();
      
              reader.readAsDataURL(event.target.files[i]); // read file as data url
        
              reader.onload = (e) => { // called once readAsDataURL is completed
                console.log(e);
                console.log(e);
                 this.media2.push({file : reader.result, type : type.substr(0,5) , name : name})
                // this.des.push(event.target.result);
              }
      
      console.log( this.media2 );
      
      
      
      
              
            }
            console.log(this.selectedFile2);
          }

        deleteProductImage2(index)
        {
          //console.log(index);
          this.selectedFile2.splice(index,1)
          this.media2.splice(index,1)
        }

        fileChange3(event) {
      
            console.log(event.target.files);
            for (var i = 0; i < event.target.files.length; i++) {
              this.selectedFile3.push(event.target.files[i]);
              var type = event.target.files[i].type;
              var name = event.target.files[i].name;
      
      
              var reader = new FileReader();
      
              reader.readAsDataURL(event.target.files[i]); // read file as data url
        
              reader.onload = (e) => { // called once readAsDataURL is completed
                console.log(e);
                console.log(e);
                 this.media3.push({file : reader.result, type : type.substr(0,5) , name : name})
                // this.des.push(event.target.result);
              }
      
      console.log( this.media3 );
      
      
      
      
              
            }
            console.log(this.selectedFile3);
          }

        deleteProductImage3(index)
        {
          //console.log(index);
          this.selectedFile3.splice(index,1)
          this.media3.splice(index,1)
        }

        getContractorList(){
            let filter={};
            filter={
                mode:0
            };
            this.db.post_rqst({'filter':filter},'karigar/contractorList').subscribe((result)=>{
                console.log(result)
                this.contractorList=result['contractorData']['data'];
            })
        }
        
    }
    