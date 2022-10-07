import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ComplaintsNatureProblemComponent } from '../complaints/complaints-nature-problem/complaints-nature-problem.component';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-plumber-meet-data',
  templateUrl: './plumber-meet-data.component.html',
  styleUrls: ['./plumber-meet-data.component.scss']
})
export class PlumberMeetDataComponent implements OnInit {
  
  
  filter:any = {};
  loading_list = false;
  current_page = 1;
  plumber_data_list : any = [];
  
  
  
  constructor(public db: DatabaseService,public alert:MatDialog) { 
    this.get_plumber_data_list();
  }
  
  ngOnInit() {
  }
  
  
  get_plumber_data_list() {
    console.log("get_plumber_data_list method calls");
    this.loading_list=true;
    this.db.post_rqst( { 'filter': this.filter}, 'karigar/plumber_meet_listing' ).subscribe(result => {
      console.log(result);
      this.plumber_data_list = result['plumber_meet']
      this.loading_list = false;
      
    });
  }
  
  
  view_plumber_data(id){
    console.log("view_plumber_data method calls");
    const dialogRef = this.alert.open(ComplaintsNatureProblemComponent,{
      width: '800px',
      height:'500px',
      
      data: {
        'id' : id,
        'from' : 'plumber_meet_list_page',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result ){
        this.get_plumber_data_list();
      }
    });
  }

  con_date(date,type){
    this.filter[type] = moment(date).format('YYYY-MM-DD');
    this.get_plumber_data_list();
  }
  
  
}
