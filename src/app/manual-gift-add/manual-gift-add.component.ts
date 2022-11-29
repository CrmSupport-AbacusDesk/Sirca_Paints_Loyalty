import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { retry } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { SessionStorage } from 'src/app/_services/SessionService'

@Component({
  selector: 'app-manual-gift-add',
  templateUrl: './manual-gift-add.component.html',
  styleUrls: ['./manual-gift-add.component.scss']
})
export class ManualGiftAddComponent implements OnInit {
  remark_text: any
  loading_list: boolean = false;
  item: any = {};
  pc: any = [];
  giftArray: any = [];
  giftArray2: any = [];
  tempSearch: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public db: DatabaseService, public session: SessionStorage, public alert: DialogComponent, public dialogRef: MatDialogRef<ManualGiftAddComponent>, public dialog: DialogComponent) {
    this.getPc();
    this.getGiftArray();
  }

  ngOnInit() {
  }

  manual_gift_save() {
    this.item.created_by = this.db.datauser.id;

    this.db.post_rqst({ 'data': this.item }, 'offer/masterGiftKarigars').pipe(
      retry(3)
    ).subscribe((res) => {
      console.log(res);
      if (res['status'] == 'SUCCESS') {
        this.dialogRef.close(true);
        this.alert.success(res['points']+' Points has been Deducted From Contractor Points.');
      }
      if (res['status'] == 'Failed') {
        this.alert.error(res['points']+' Points Has Less For Redeem This Gift.');
      }
    })

  }



  pc2: any = []
  getPc() {
    let filter = {};
    filter = {
      mode: 0
    };
    this.db.post_rqst({ 'filter': filter }, 'karigar/contractorList')
      .subscribe(d => {
        console.log(d);
        this.pc = d.contractorData['data'];
        this.pc2 = d.contractorData['data'];
      }, error => {
        this.loading_list = false;
      });
  }


  searchPc(contractor_name) {
    this.tempSearch = '';
    this.pc = [];
    for (let x = 0; x < this.pc2.length; x++) {
      contractor_name = contractor_name.toLowerCase();
      this.tempSearch = this.pc2[x]['first_name'].toLowerCase();
      let tempSearch2 = '';
      tempSearch2 = this.pc2[x]['mobile_no'].toLowerCase();

      if (this.tempSearch.includes(contractor_name)) {
        this.pc.push(this.pc2[x]);
      }
      if (tempSearch2.includes(contractor_name)) {
        this.pc.push(this.pc2[x]);
      }
    }
  }

  getGiftArray() {
    let filter = {};
    filter = {
      mode: 0
    };
    this.db.post_rqst({ 'filter': filter }, 'offer/giftArray')
      .subscribe(d => {
        console.log(d);
        this.giftArray = d['GiftList'];
        this.giftArray2 = d['GiftList'];
      }, error => {
        this.loading_list = false;
      });
  }


  searchGiftArray(gift_name) {
    this.tempSearch = '';
    this.giftArray = [];
    for (let x = 0; x < this.giftArray2.length; x++) {
      gift_name = gift_name.toLowerCase();
      this.tempSearch = this.giftArray2[x]['gift_name'].toLowerCase();


      if (this.tempSearch.includes(gift_name)) {
        this.giftArray.push(this.giftArray2[x]);
      }

    }
  }


}
