import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';
import { ProductImageModuleComponent } from '../master/product-image-module/product-image-module.component';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-gift-master',
  templateUrl: './gift-master.component.html',
  styleUrls: ['./gift-master.component.scss']
})
export class GiftMasterComponent implements OnInit {
  loading_list: boolean = false;
  filter: any = {};
  toggle1: any;

  current_page = 1;
  last_page: number ;
  image: any = [];
  giftMasterList: any = [];
  giftCategory: any = {};
  savingData = false;
  total_giftMaster:any;
  save_button_disabled: boolean = false;
  
  constructor(public alrt: MatDialog, public db: DatabaseService, public route: Router, public dialog: DialogComponent) { 
    this.getGiftMasterList();
  }

  ngOnInit() {
  }

  
  redirect_previous() {
    this.current_page--;
    this.getGiftMasterList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getGiftMasterList();
  }

  getGiftMasterList() {
    this.loading_list=true;

    this.db.post_rqst({'filter':this.filter},'offer/masterGiftList?page='+this.current_page).pipe(
      retry(3)
    ).subscribe((result)=>{
      console.log(result);
    this.loading_list=false;
    this.current_page = result['manualGiftList'].current_page;
    this.last_page = result['manualGiftList'].last_page;
    this.total_giftMaster =result['manualGiftList'].total;
      this.giftMasterList=result['manualGiftList'].data;
    },err=>{
    this.loading_list=false;

    })

  }
  SaveGiftMaster() {
    this.savingData = true;
    this.save_button_disabled = true;
    this.loading_list = true;
    this.giftCategory.created_by = this.db.datauser.id;
    this.db.insert_rqst({ 'data': this.giftCategory }, 'offer/manualGiftAdd').pipe(
      retry(3)
    ).subscribe((res) => {
      console.log(res);
      this.savingData = false;
      this.loading_list = false;

      this.save_button_disabled = false;
      if (res['msg'] == 'SUCCESS') {

        this.route.navigate(['gift-master-list'])
        this.dialog.success('Successfully added');

      }
      if (res['status'] == 'UPDATED') {

        this.route.navigate(['gift-master-list'])
        this.dialog.success('Successfully Updated');

      }
      this.toggle1 = "false";

      this.selected_image = [];
      this.getGiftMasterList();

    }, err => {
      console.log(err);
      this.savingData = false;
      this.loading_list = false;

      this.save_button_disabled = false;
    })



  }

  openDialog(id, string) {

    const dialogRef = this.alrt.open(ProductImageModuleComponent, {
      width: '1024px',
      data: {
        'id': id,
        'mode': string,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });

  }
  active: any = '';
  ProductProfile(index) {
    this.active = index;
    this.giftCategory.profile_selected = index;
  }

  addGiftMaster() {

  }

  deleteGiftMasterImage(index) {

  }

  onUploadChange(evt: any) {
    console.log(evt);
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded1.bind(this);
      reader.readAsBinaryString(file);
      console.log(reader);
      console.log('in if')
    }
  }
  selected_image: any = [];
  handleReaderLoaded1(e) {
    this.giftCategory.image = 'data:image/png;base64,' + btoa(e.target.result);
    console.log(this.giftCategory.image)
    console.log(this.selected_image)
  }

  editCategory(points,name,image,id){
    this.giftCategory.image=image;
    this.giftCategory.gift_name=name;
    this.giftCategory.gift_points=points;
    this.giftCategory.id=id

  }

  deleteGiftMaster(id){
    this.loading_list=true;
    this.dialog.delete("").then((result)=>{
      if(result){
        this.db.post_rqst({'id':id},'offer/masterGiftDelete').subscribe((response)=>{
          console.log(response);
          this.loading_list=false;
          if(response['msg']=='SUCCESS'){
            this.getGiftMasterList();
          }
        },err=>{
          this.loading_list=false;
        })
      }
    })
   

  }

}
