import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../_services/DatabaseService';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})


export class PopupComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  status: any = {};
  savingData = false;

  // tslint:disable-next-line:variable-name
     all_distributor: any = {};
  constructor( public serve: DatabaseService) {



  }

  ngOnInit() {

      this.getDistributorList();
  }

  getDistributorList() {


    this.serve.fetchData({}, 'Distributors/all_distributors').subscribe((result => {
      console.log(result);
      this.savingData = false;
      this.all_distributor = result;
      console.log(this.all_distributor);
    }
    ));
  }
  statusVerified() {
    // tslint:disable-next-line:triple-equals




    this.serve.post_rqst({}, 'karigar/karigarStatus').subscribe((d => {
          // this.loading_list = false;
          // this.dialog.success('Status successfully Change');
          // this.getKarigarList();
          // });


          // this.serve.fetchData(this.status, 'Distributors/confirm_lead').subscribe((result => {
          console.log(d);

          // tslint:disable-next-line:triple-equals
          const companyIndex = this.status.all_distributor.all_distributor.findIndex(row => row.id == this.status.dr_id);
          this.status.company_name = this.status.all_distributor.all_distributor[companyIndex].company_name;
          console.log(this.status.company_name);
    }));
  }

}
