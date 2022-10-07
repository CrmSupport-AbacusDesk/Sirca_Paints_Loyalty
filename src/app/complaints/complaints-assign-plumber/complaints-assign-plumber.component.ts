import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-complaints-assign-plumber',
  templateUrl: './complaints-assign-plumber.component.html',
})
export class ComplaintsAssignPlumberComponent implements OnInit {
  data: any = {};
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  complaint:any = {};
  assigned_plumber:any = {};
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public model_data: any, public dialogRef: MatDialogRef<ComplaintsAssignPlumberComponent>) {
      //console.log(model_data);
      
      this.data.id = model_data.id; 
      this.assigned_plumber = model_data.assigned_plumber; 

      this.complaint.sales_name = this.assigned_plumber;
      console.log(this.assigned_plumber);
      
    }
    ngOnInit() {
      this.AssignSaleUser();
    }

    sales_users:any=[];
    serarch_plumber:any ={};
    AssignSaleUser()
    {
      this.loading_list = true;
      this.db.post_rqst( { 'id': this.data.id}, 'karigar/plumberList')
      .subscribe(d => {
        //console.log(d);
        
        this.loading_list = false;
        this.sales_users = d.plumber_list;
        this.serarch_plumber = d.plumber_list;
        this.temp_cons = d.plumber_list;

       
      });
    }


    addCompalintStatus(form:any)
    {
      this.savingData = true;
      this.complaint.created_by = this.db.datauser.id;

      this.db.post_rqst( { 'status' : this.complaint ,'id': this.data.id, 'mobile': this.selectEvent }, 'karigar/updateAssignPlumber')
      .subscribe( d => {
        this.savingData = false;
        this.dialog.success( 'Status successfully Change');
        this.dialogRef.close(true);
        //console.log( d );
        console.log(form.mobile);
      });
    }

    selectSales(){
      this.complaint.sales_mobile = this.sales_users.filter( x => x.id  === this.complaint.sales_name )[0].mobile_no;
      // this.complaint.sales_id = this.sales_users.filter( x => x.id  === this.complaint.sales_name )[0].id;
    }

    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

    onNoClick(): void{
    this.dialogRef.close();
    }

    active:any={};

toggleterritory1(key,action)
{
  console.log(action);
  console.log(key);
  
  if(action == 'open')
  { this.active.user1 = true; }
  if(action == 'close')
  { this.active.user1 = false;}

  console.log(this.active);


}


search2:any={};
tmpsearch3:any={};
temp_cons:any=[];

getItemscheckin(con,search)
{
  console.log(search);
  if(con=='con2'){
    this.sales_users=[];
    for(var i=0;i<this.temp_cons.length; i++)
    {
      search=search.toLowerCase();
      this.tmpsearch3=this.temp_cons[i]['first_name'].toLowerCase();
      if(this.tmpsearch3.includes(search))
      {
        this.sales_users.push(this.temp_cons[i]);
      }     
    }    
    console.log(this.serarch_plumber);
  }
 
  
}




keyword = 'user';


selectEvent(item) {
  this.complaint.sales_name = item.id;
  // console.log(   this.data.part_number );
  
  // if(this.data.part_number){
  //   // this.partDetail();
  //   this.data = Object.assign({}, this.parts.filter(x => x.part_number === this.data.part_number )[0] ); 


  // }
  
}


// combo_keyword = 'combo_name';

// selectComboEvent(item) {
//   this.data.combo_name = item.combo_name;
//   console.log(   this.data.combo_name );
  
//   if(this.data.combo_name){
//     this.partDetail();
//   }
  
// }


onChangeSearch(val: string) {
  
}

onFocused(e){
}



  }
