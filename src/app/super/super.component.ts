import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../_services/DatabaseService';
import {DialogComponent} from '../dialog/dialog.component';
import { ProductImageModuleComponent } from '../master//product-image-module/product-image-module.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorage} from '../_services/SessionService';
import { MatDialog, MatDatepicker } from '@angular/material';
import { DeactiveStatusComponent } from 'src/app/deactive-status/deactive-status.component';

@Component({
  selector: 'app-super',
  templateUrl: './super.component.html',
})
export class SuperComponent implements OnInit {
  
  loading_list = false;
  karigars: any = [];
  total_gift = 0;
  offer:any= 0;
  gift_offer:any= 0;
  karigar_all:any =0;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  filter:any = {};
  filtering : any = false;
  
   
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public dialog: DialogComponent, public alrt:MatDialog ) {}
    
    ngOnInit() {
      this.filter.status = '';
      this.getSuperList();
    }

    openDatePicker(picker : MatDatepicker<Date>)
    {
      picker.open();
    }
    redirect_previous() {
      this.current_page--;
      this.getSuperList();
    }
    redirect_next() {
      if (this.current_page < this.last_page) { this.current_page++; }
      else { this.current_page = 1; }
      this.getSuperList();
    }


    getSuperList() 
    {
      this.loading_list = true;
      this.filtering = false;
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      this.filter.start_date = this.filter.start_date  ? this.db.pickerFormat(this.filter.start_date) : '';
      this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';

      // tslint:disable-next-line:max-line-length
      if( this.filter.date   || this.filter.first_name  ||this.filter.dealer || this.filter.chnprtnr || this.filter.mobile_no  || this.filter.search || this.filter.address )this.filtering = true;
       this.filter.mode = 0;


      this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'karigar/supperKarigarList?page=' + this.current_page )
      .subscribe( d => {
        this.loading_list = false;
        //console.log(d);

        this.karigars = d.karigars.data;
        this.karigar_all = d.karigar_all;
        // this.total_gift = d.gift.total;
      });
    }
   
    exportSuper()
    {
      this.filter.mode = 1;
      this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'karigar/exportSuper')
      .subscribe( d => {
        this.loading_list = false;
        document.location.href = this.db.myurl+'/app/uploads/exports/Super30.csv';
        //console.log(d);
      });
    }
   
   
    }
