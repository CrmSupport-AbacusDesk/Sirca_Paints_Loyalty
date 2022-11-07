import { Component, OnInit } from '@angular/core';
import { MatDatepicker, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-sales-user-list',
  templateUrl: './sales-user-list.component.html',
  styleUrls: ['./sales-user-list.component.scss']
})
export class SalesUserListComponent implements OnInit {
  
  loading_list = true;
  salesUser: any = [];
  total_dealers = 0;
  dealer_all:any =0;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  filter:any = {};
  filtering : any = false;
  select_all:any=false;
  
  dealer_pending : any = 0;
  dealer_reject : any = 0;
  dealer_suspect : any = 0;
  dealer_verified : any = 0;
  
  constructor(public db: DatabaseService, private router:Router, public dialog: DialogComponent,public route:ActivatedRoute,public alrt:MatDialog) {
    this.route.params.subscribe(resp=>{
      this.current_page = resp.page;
      console.log("helo");
      
    });
    if(this.filter.status == undefined)
    {
      this.filter.status = 'All';
    }
  }
  
  ngOnInit() {
    this.getUserList(''); 
    this.AssignSaleUser();
  }
  
  openDatePicker(picker : MatDatepicker<Date>)
  {
    picker.open();
  }
  redirect_previous() {
    this.current_page--;
    this.getUserList('');
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getUserList('');
  }
  
  set_filter(data)
  {
    this.db.set_filters(data);
  }
  current1()
  {
    this.current_page = 1;
    this.getUserList('');
  }
  last1()
  {
    this.current_page = this.last_page;
    this.getUserList('');
  }
  
  total_wallet_point:any = 0;
  
  getUserList(action:any) 
  {
    console.log(this.filter);
    this.loading_list = true;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    if( this.filter.date)this.filtering = true;
    this.filter.mode = 0;
    
    if(action=='refresh')
    {
      this.select_all = false;
      let status = this.filter.status
      this.filter={}
      this.filter.status= status;
      this.current_page = 1;
    }
    
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser,user_type:"3"}, 'karigar/salesUsersList?page=' + this.current_page)
    .subscribe( d => {
      this.loading_list = false;
      console.log(d);            
      this.current_page = d.sales_users.current_page;
      this.last_page = d.sales_users.last_page;
      this.total_dealers =d.sales_users.total;
      this.salesUser = d.sales_users.data;                  
      
      console.log(this.salesUser);
      
    
    });
  }
  
  
  exportDealer()
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser,user_type:'3'}, 'karigar/exportKarigar')
    .subscribe( d => {
      document.location.href = this.db.myurl+'/app/uploads/exports/SalesExecutives.csv';
      console.log(d);
    });
  }

  
  sales_users:any=[];
  AssignSaleUser()
  {
    this.db.get_rqst('','karigar/sales_users')
    .subscribe(d => {
      console.log(d);
      this.sales_users = d.sales_users;
    });
  }
  deleteDealer(id)
  {
    this.dialog.delete('Dealer')
    .then((result) => {
      if(result)
      {
        this.db.post_rqst({'id': id}, 'karigar/remove')
        .subscribe(d => {
          console.log(d);
          this.getUserList('');
          this.dialog.successfully();
        });
      }
    });
  }



  edit(id){
    this.router.navigate(['/user/' + id]);
}
  // dealerStatus(id,status)
  // {
  //   const dialogRef = this.alrt.open(ChangeStatusComponent,{
  //     width: '500px',
  //     // height:'500px',
      
  //     data: {
  //       'id' : id,
  //       'status' : status,
  //       'target' : 1,
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if( result ){
  //       this.getUserList('');
  //     }
  //   });
  // }

}
