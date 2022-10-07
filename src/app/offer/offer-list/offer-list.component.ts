import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource, MatDialog,MatDatepicker} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import * as moment from 'moment';
import { DeactiveStatusComponent } from 'src/app/deactive-status/deactive-status.component';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
})
export class OfferListComponent implements OnInit {
  today:any = moment().format("YYYY-MM-DD");
  
  loading: any;
  data: any;
  loading_list = true;
  offer: any = [];
  total_offer = 0;
  karigar_all:any =0;
  offer_all : any = 0;
  offer_active : any = 0;
  offer_deactive : any = 0;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  filter:any = {};
  filtering : any = false;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public db: DatabaseService, public dialog: DialogComponent,public alrt:MatDialog ) { }
  
  ngOnInit() {
    this.filter.status = '';
    this.getOfferList();
  }

  openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
  redirect_previous() {
    this.current_page--;
    this.getOfferList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getOfferList();
  }
  getOfferList() 
  {
    this.loading_list = true;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    this.filter.start_date = this.filter.start_date  ? this.db.pickerFormat(this.filter.start_date) : '';
    this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
    if( this.filter.date )this.filtering = true;
    this.filter.mode = 0;
    
    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'offer/offerList?page=' + this.current_page )
    .subscribe( d => {
      this.loading_list = false;
      //console.log(d);
      this.current_page = d.offer.current_page;
      this.last_page = d.offer.last_page;
      this.total_offer =d.offer.total;
      this.offer = d.offer.data;
      for(let i=0;i<this.offer.length;i++)
      {
        if(this.offer[i].offer_status=="Active")
        {
          this.offer[i].newsStatus=true;
        }
        else if(this.offer[i].offer_status=="Deactive")
        {
          this.offer[i].newsStatus=false;
        }
      }
      this.offer_all = d.offer_all;
      this.offer_active = d.offer_active;
      this.offer_deactive = d.offer_deactive;
    });
  }
  
  exportoffers()
  {
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'offer/exportOffer')
    .subscribe( d => {
      this.loading_list = false;
      this.filter.mode = 0;
      
      document.location.href = this.db.myurl+'/app/uploads/exports/offers.csv';
      //console.log(d);
    });
  }
  
  
  deleteOffer(id) {
    this.dialog.delete('Offer').then((result) => {
      if(result) {
    this.db.post_rqst({ id : id}, 'offer/remove')
    .subscribe(d => {
      //console.log(d);
      this.getOfferList();
      this.dialog.successfully();
    });
  }
    });
  } 

  updateStatus(i,event)
  {
    //console.log(event);
    //console.log(event.checked);
    if(event.checked == false)
    {
      //console.log('false');
      
      const dialogRef = this.alrt.open(DeactiveStatusComponent,
        {
          width: '500px',
          height:'500px',
          
          data: {
            'id' : this.offer[i].id,
            'type':'offer',
            'checked' : event.checked,
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log(`Dialog result: ${result}`);
          if( result ){
            // this.db.post_rqst({'checked' : event.checked, 'id' : this.offer[i].id, 'login_id':this.db.datauser.id}, 'offer/offerStatus')
            // .subscribe(d => {
            //   //console.log(d);
            //   this.dialog.success( 'Gift Status Change successfully ');
            //   this.getOfferList();
            // });
          this.getOfferList();
          }
          this.getOfferList();
        });
      }
      else if(event.checked == true){
        this.db.post_rqst({'checked' : event.checked, 'id' : this.offer[i].id, 'login_id':this.db.datauser.id}, 'master/offerStatus')
        .subscribe(d => {
          //console.log(d);
          this.dialog.success( 'Gift Status Change successfully ');
          this.getOfferList();
        });
      }  
    }
  }
  