import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-complaints-edit-gallery',
  templateUrl: './complaints-edit-gallery.component.html',
})
export class ComplaintsEditGalleryComponent implements OnInit {
  
  data: any = [];
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  offer_id;
  gallery:any = {};
  compliant_id;
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<ComplaintsEditGalleryComponent>) {
      
      this.compliant_id=lead_data.compliant_id;
       
      // this.data.gift_id = lead_data.gift_id; 
      
    }
    ngOnInit() {
    }
   


   


    selectedFile: File[]=[];
    type:any = {};
    media:any=[];
    
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
           this.media.push({file: reader.result, type : type.substr(0,5) , name : name})
          // this.des.push(event.target.result);
        }

console.log( this.media );




        
      }
      console.log(this.selectedFile);
    }
    
    urls = new Array<string>();
    
    
    formData = new FormData();
    
    
    i:any = 0;
    
    addGallery(form:any) {
      
      if(this.selectedFile.length > 0) {
        
        for (let f of this.selectedFile)
        {
          // this.formData.append(this.i, f, f.name);
          this.formData.append('images'+this.i,  f , f.name);
          
          this.i++;
        }
      }
      
      
      
      this.loading_list = true;
      this.savingData = true;
     
  
      this.db.fileData( this.formData  , 'app_karigar/compliantAttchment/'+ this.compliant_id )
      .subscribe( d => {
        this.savingData = false;
        this.loading_list = false;
        this.dialogRef.close(true);

        this.dialog.success('Complaint Image and Video Successfully Added');
      });
    }


    deleteProductImage(index)
    {
      //console.log(index);
      this.selectedFile.splice(index,1)
      this.media.splice(index,1)
    }


  }
  