import { Component, OnInit } from '@angular/core';
import {MatPaginator, MatTableDataSource, MatDialog, MatDatepicker} from '@angular/material';
import { GiftRedeemModuleComponent } from '../gift-redeem-module/gift-redeem-module.component';
import { TransferCodeComponent } from '../transfer-code/transfer-code.component';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../../master//product-image-module/product-image-module.component';
import { ImportStatusModelComponent } from '../../offer/import-status-model/import-status-model.component';
import { EditGiftComponent } from '../../offer/edit-gift/edit-gift.component';
import { DeactiveStatusComponent } from 'src/app/deactive-status/deactive-status.component';
import { ReopenRemarkModleComponent } from '../reopen-remark-modle/reopen-remark-modle.component';
import {ChangeStatusComponent} from '../../gift-gallery/change-status/change-status.component';



@Component({
    selector: 'app-offer-detail',
    templateUrl: './offer-detail.component.html',
})
export class OfferDetailComponent implements OnInit {
    
    offer_id;
    loading_list = true;
    filter:any = {};
    savingData = false;
    filtering : any = false;
    logs:any=[];
    
    
    constructor(public db: DatabaseService, public route: ActivatedRoute, private router: Router, public ses: SessionStorage,
        public dialog: DialogComponent, public alrt:MatDialog ) {
            console.log(this.route);
            console.log(this.route.params['_value']['offer_id']);
        }
        
        ngOnInit() {
            this.route.params.subscribe(params => {
                console.log(params);
                
                this.offer_id = this.db.crypto(params['offer_id'],false);
                console.warn(this.offer_id);
                
                this.getOfferDetails();
                this.getParticipantsList();
                this.getStateList();
            });
        }
        
        openDatePicker(picker : MatDatepicker<Date>)
        {
            picker.open();
        }
        
        getData:any = {};
        gift:any = [];
        getOfferDetails() {
            this.loading_list = true;
            this.db.post_rqst(  {'offer_id':this.offer_id}, 'offer/offerDetail')
            .subscribe(d => {
                this.loading_list = false;
                //console.log(d);
                this.getData = d.offer;
                this.gift = d.gift;
                
                this.logs =d.logs;
                
                if(this.getData.offer_status=="Active")
                {
                    this.getData.newsStatus=true;
                }
                else if(this.getData.offer_status=="Deactive")
                {
                    this.getData.newsStatus=false;
                }
                for (let i = 0; i < this.gift.length; i++) {
                    
                    if(this.gift[i].status=="Active")
                    {
                        this.gift[i].giftStatus=true;
                        //console.log( this.gift[i].newsStatus);
                    }
                    else if(this.gift[i].status=="Deactive")
                    {
                        this.gift[i].giftStatus=false;
                        //console.log(this.gift[i].newsStatus);
                        
                    }
                }   
                
                
            });
        }
        
        last_page: number ;
        current_page = 1;
        
        redirect_previous() {
            this.current_page--;
            this.getParticipantsList();
        }
        redirect_next() {
            if (this.current_page < this.last_page) { this.current_page++; }
            else { this.current_page = 1; }
            this.getParticipantsList();
        }
        
        requestchangeStatus(i,id,status)
        {
            //console.log(status);
            
            const dialogRef = this.alrt.open(ChangeStatusComponent,
                {
                    width: '500px',
                    height:'500px',
                    
                    data: {
                        'id' : id,
                        'status' : status,
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    if( result ){
                        // this.getRedeemList();
                    }
                });
                
            }
            
            
            karigars:any=[];
            sccaned_coupon_count:any = 0;
            getParticipantsList() {
                //console.log(this.db.datauser);
                
                this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
                this.filter.dob = this.filter.dob  ? this.db.pickerFormat(this.filter.dob) : '';
                if( this.filter.date || this.filter.dob)this.filtering = true;
                
                this.loading_list = true;
                this.filter.offer_id = this.offer_id;
                this.db.post_rqst(  {'filter': this.filter}, 'offer/offerKarigarList?page=' + this.current_page)
                .subscribe(d => {
                    this.loading_list = false;
                    this.karigars =  d.karigars.data;
                    this.sccaned_coupon_count = d.karigars.total;
                    this.current_page = d.karigars.current_page;
                    this.last_page = d.karigars.last_page;
                });
            }
            
            addOffer:any={};
            states:any=[];
            getStateList(){
                // this.loading_list = true;
                this.db.post_rqst({'offer_id': this.offer_id}, 'offer/getEditStates')
                .subscribe( d => {  
                    // this.loading_list = false;  
                    //console.log( d );
                    this.states = d.states;
                    // this.temp_cons = d.states;
                    this.getDistrictList();
                });
            }
            allState(){
                if( !this.addOffer.allStates ){
                    for (let i = 0; i < this.states.length; i++) {
                        this.states[i].selected = false;
                    }
                }else{
                    for (let i = 0; i < this.states.length; i++) {
                        this.states[i].selected = true;
                    }
                }
                this.getDistrictList();
            }
            
            districts:any=[];
            getDistrictList(){
                this.loading_list = true;
                this.db.post_rqst( { 'state': this.states, 'offer_id':this.offer_id }, 'offer/getEditDistrict')
                .subscribe(d => {  
                    this.loading_list = false;
                    this.districts = d.state;
                });
            }
            
            
            allDistrict(){
                
                if( !this.addOffer.allDistrict ){
                    for (let i = 0; i < this.districts.length; i++) {
                        this.districts[i].stateWiseDistrict = false;
                        if(this.districts[i].selected){
                            for (let x = 0; x < this.districts[i].districts.length; x++) {
                                this.districts[i].districts[x].selected = false;
                            }
                        }
                    }
                }else{
                    for (let i = 0; i < this.districts.length; i++) {
                        this.districts[i].stateWiseDistrict = true;
                        
                        if(this.districts[i].selected){
                            for (let x = 0; x < this.districts[i].districts.length; x++) {
                                // //console.log(this.districts[i].districts[x]);
                                this.districts[i].districts[x].selected = true;
                            }
                        }
                    }
                }
                
            }
            
            
            allStateWiseDistrict(index){
                
                for (let x = 0; x < this.districts[ index ].districts.length; x++) {
                    if( this.districts[ index ].stateWiseDistrict == true ){
                        
                        this.districts[ index ].districts[x].selected = true;
                    }else{
                        
                        this.districts[ index ].districts[x].selected = false;
                    }
                }
                this.getParticipantsList();
            }
            
            saveOffer(form:any) {
                
                this.savingData = true;
                this.loading_list =true;
                this.districts.created_by = this.db.datauser.id;
                this.db.post_rqst( {  'area' : this.districts, 'login_id' :this.db.datauser.id ,'offer_id':this.offer_id }, 'offer/updateOfferArea')
                .subscribe( d => {
                    this.loading_list =false;
                    this.savingData = false;
                    this.dialog.success( 'Area successfully Update');
                    this.getOfferDetails();
                    this.getStateList();
                });
            }
            
            deleteGift(id) {
                this.dialog.delete('Gift').then((result) => {
                    if(result) {
                        this.db.post_rqst({'id': id, 'offer_id' : this.offer_id, 'login_id': this.db.datauser.id}, 'offer/removeGift')
                        .subscribe(d => {
                            this.getOfferDetails();
                            this.dialog.successfully();
                        });
                    }
                });
            } 
            
            reponeCoupon(id) {
                const dialogRef = this.alrt.open(ReopenRemarkModleComponent,
                    {
                        width: '500px',
                        height:'500px',
                        data: {
                            'id' : id,
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if( result ){
                            this.getParticipantsList();
                        }
                    });
                }
                
                giftRedeem(id , point)
                {
                    if( point == 0 ){
                        return;
                    }
                    const dialogRef = this.alrt.open(GiftRedeemModuleComponent,
                        {
                            width: '650px',
                            height:'500px',
                            
                            data: {
                                'gift_id' : id,
                                'offer_id'  :   this.offer_id,
                            }
                        });
                        dialogRef.afterClosed().subscribe(result => {
                        });
                        
                    }
                    updateStatus(event)
                    {
                        if(event.checked == false)
                        {
                            const dialogRef = this.alrt.open(DeactiveStatusComponent,
                                {
                                    width: '500px',
                                    height:'500px',
                                    
                                    data: {
                                        'id' : this.getData.id,
                                        'type':'offer',
                                        'checked' : event.checked,
                                    }
                                });
                                dialogRef.afterClosed().subscribe(result => {
                                    if( result ){
                                        this.getOfferDetails();
                                        
                                    }
                                });
                            }
                            else if(event.checked == true)
                            {
                                this.db.post_rqst({'checked' : event.checked, 'id' : this.getData.id , 'login_id' : this.db.datauser.id}, 'master/offerStatus')
                                .subscribe(d => {
                                    this.dialog.success( 'Gift Status Change successfully ');
                                    this.getOfferDetails();
                                });
                            }
                            this.getOfferDetails();
                        }
                        updateGiftStatus(event,id)
                        {
                            if(event.checked == false)
                            {
                                const dialogRef = this.alrt.open(DeactiveStatusComponent,
                                    {
                                        width: '500px',
                                        height:'500px',
                                        
                                        data: {
                                            'id' : id,
                                            'type':'gift',
                                            'checked' : event.checked,
                                        }
                                    });
                                    dialogRef.afterClosed().subscribe(result => {
                                        if( result ){
                                            this.getOfferDetails();
                                        }
                                        this.getOfferDetails();
                                    });
                                }
                                else if(event.checked == true)
                                {
                                    this.db.post_rqst({'checked' : event.checked, 'id' : id,'login_id':this.db.datauser.id}, 'master/giftStatus')
                                    .subscribe(d => {
                                        this.dialog.success( 'Gift Status Change successfully ');
                                        
                                        this.getOfferDetails();
                                    });
                                }
                            }
                            openDialog4(id ,string ) {
                                const dialogRef = this.alrt.open(ProductImageModuleComponent,
                                    {
                                        // width: '500px',
                                        // height:'500px',
                                        data: {
                                            'id' : id,
                                            'mode' : string,
                                        }
                                    });
                                    dialogRef.afterClosed().subscribe(result => {
                                    });
                                }
                                openDialog2(id ,string ) {
                                    
                                    
                                    const dialogRef = this.alrt.open(ProductImageModuleComponent,
                                        {
                                            // width: '500px',
                                            // height:'500px',
                                            data: {
                                                'id' : id,
                                                'mode' : string,
                                            }
                                        });
                                        dialogRef.afterClosed().subscribe(result => {
                                        });
                                    }
                                    edit(){
                                        this.router.navigate(['/edit-offer/' +  this.db.crypto(this.offer_id)]);
                                    }
                                    
                                    count: any = 0;
                                    formData = new FormData();
                                    exist_coupon:any=[];
                                    editgift(id) {
                                        const dialogRef = this.alrt.open(EditGiftComponent,
                                            {
                                                width: '800px',
                                                // height:'500px',
                                                data: {
                                                    'id' : id,
                                                    'offer_id':this.offer_id,
                                                    // 'mode' : string,
                                                }
                                            });
                                            dialogRef.afterClosed().subscribe( r => {
                                                if( r )
                                                {
                                                    this.getOfferDetails();
                                                    this.getParticipantsList();
                                                } 
                                                    
                                            });
                                        }
                                        
                                    }
                                    
                                    