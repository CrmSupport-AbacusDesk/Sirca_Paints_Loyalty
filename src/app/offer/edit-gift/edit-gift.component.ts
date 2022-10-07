import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-edit-gift',
  templateUrl: './edit-gift.component.html',
})
export class EditGiftComponent implements OnInit {
  
  data: any = [];
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  offer_id;
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<EditGiftComponent>) {
      
      this.data.id = lead_data.id;
      this.offer.offer_id=lead_data.offer_id;
      //console.log(this.data.id);
       
      // this.data.gift_id = lead_data.gift_id; 
      
    }
    ngOnInit() {

    //   this.route.params.subscribe(params => {
    //     this.offer_id = params['offer_id'];
    // });
    this.giftDetail();
    }
   
    offer:any = {};
    giftDetail() {
      if(!this.data.id)return;
      this.loading_list = true;
      this.db.post_rqst(  {'id' : this.data.id } , 'offer/giftEditDetail')
      .subscribe( d => {
        this.loading_list = false;
        //console.log( d );
        this.offer = d.gift;
      });
    }

    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

    addoffer(form:any)
    {
      this.offer.id=this.data.id;
      this.offer.created_by=this.db.datauser.id;
      if( !this.offer.image ){
        this.dialog.warning('Required Gift Image!');
        return;
      }
      this.savingData = true;
      this.db.post_rqst( { 'id': this.data.id , 'offer':this.offer }, 'offer/giftEdit')
      .subscribe( d => {
        this.savingData = false;
        if(this.data.id ){
          this.dialog.success('Gift Successfully Update!');
        }else{
          this.dialog.success('Gift Successfully Added!');
        }
        this.dialogRef.close(true);
        //console.log( d );
      });
    }

    onNoClick(): void{
    this.dialogRef.close();
    }

    onUploadChange2(evt: any) {
      const file = evt.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded2.bind(this);
        reader.readAsBinaryString(file);
      }
    }
    handleReaderLoaded2(e) {
      this.offer.image = 'data:image/png;base64,' + btoa(e.target.result) ;
      //console.log( this.offer.image );
    }
  }
  