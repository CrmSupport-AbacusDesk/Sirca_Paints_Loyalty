import {Component,OnInit , Input} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import { ProductImageModuleComponent } from '../product-image-module/product-image-module.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { MatDialog, MatDatepicker } from '@angular/material';

import { DeactiveStatusComponent } from 'src/app/deactive-status/deactive-status.component';
import { CategoryModelComponent } from '../category-model/category-model.component';
import { ChangePriceModelComponent } from '../change-price-model/change-price-model.component';
@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
})
export class ProductsListComponent implements OnInit {
    
    loading: any;
    source: any = '';
    loading_page = false;
    loading_list = false;
    loader: any = false;
    locations: any = [];
    products:any = [];
    total_products:any = 0;
    last_page: number ;
    current_page = 1;
    search: any = '';
    searchData = true;
    isInvoiceDataExist = false;
    filter:any = {};
    filtering : any = false;
    savingData = false;
    productForm: any = {};
    image = new FormData();
    selected_image :any = [];
    formData = new FormData();
    // formData.append('file', this.uploadForm.get('profile').value)
    constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
        public dialog: DialogComponent, public alrt:MatDialog, public dialogs: MatDialog ) {}
        
        ngOnInit() {
            this.getMainCategory();
            this.getProductList();
            this.productForm.image=[];
            this.productForm= {};
            this.category.profile_selected = 0;
        }


        
        
        openDatePicker(picker : MatDatepicker<Date>)
        {
            picker.open();
        }
        
        redirect_previous() {
            this.current_page--;
            this.getProductList();
        }
        redirect_next() {
            if (this.current_page < this.last_page) { this.current_page++; }
            else { this.current_page = 1; }
            this.getProductList();
        }
        
        getProductList() 
        {
            this.loading_list = true;
            this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
            if( this.filter.date || this.filter.location_id )this.filtering = true;
            
            this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'master/productList?page=' + this.current_page )
            .subscribe( d => {
                console.log(d);
                this.loading_list = false;
                this.current_page = d.products.current_page;
                this.last_page = d.products.last_page;
                this.total_products =d.products.total;
                this.products = d.products.data;
                // this.selected_image=d.products.image;
                this.productForm =  this.products;
                
                for(let i=0;i<this.products.length;i++)
                {
                    if(this.products[i].status=="Active")
                    {
                        this.products[i].newsStatus=true;
                    }
                    else if(this.products[i].status=="Deactive")
                    {
                        this.products[i].newsStatus=false;
                    }
                }
                
                //console.log( this.products );
            });
        }
        
        generate_excel()
        {
            this.loading_list = true;
            this.db.post_rqst({"test":"test"},"app_master/exportSample")
            .subscribe(resp=>{
                console.log(resp);
                document.location.href = this.db.myurl+'/app/uploads/demo.csv';
                this.loading_list = false;
            })
        }
        
        open_model()
        {
            const dialogRef = this.alrt.open(CategoryModelComponent,{
                width: '500px',
                
            });
            dialogRef.afterClosed().subscribe(result => {
            });
        }
        
        category:any=[];
        getCategory()
        {
            console.log(this.filter);
            console.log(this.productForm);
            
            this.productForm.main_category = this.productForm.main_category ? this.productForm.main_category : this.filter.main_category;
            console.log(this.productForm.main_category);
            
            this.db.post_rqst(  {'main_category' : this.productForm.main_category}, 'master/categoryForProduct')
            .subscribe(d => {
                console.log(d);
                this.category = d.category;
                //console.log(this.category);
            });
        }
        
        getCategoryAddProduct()
        {
            console.log(this.filter);
            console.log(this.productForm);
            
            this.productForm.main_category = this.productForm.main_category ? this.productForm.main_category : this.filter.main_category;
            console.log(this.productForm.main_category);
            
            this.db.post_rqst(  {'main_category' : this.productForm.main_category,'add':'addProduct'}, 'master/categoryForProduct')
            .subscribe(d => {
                console.log(d);
                this.category = d.category;
                //console.log(this.category);
            });
        }

        ma_category:any=[];
        getMainCategory()
        {
            // this.loading_list = true;
            this.db.post_rqst(  { 'filter': this.filter}, 'master/mainCategoryForProduct')
            .subscribe(d => {
                console.log(d);
                this.ma_category = d.category;
                //console.log(this.category);
                // this.loading_list = false;
                this.getCategory();
                
            });
            
        }
        
        catdata:any='';
        editProduct(id,index)
        {
            this.productForm = this.products.filter( x => x.id==id)[0];
            
            this.productForm.profile_selected = parseInt(this.productForm.profile);
            if(this.productForm.latest == '1')
            {
                this.checkNewArival(event)
            }
            
            this.selected_image=[];
            this.productForm.category_id=this.productForm.master_category_id;
            this.productForm.profile_selected = 0;
            
            for(let i=0; i<this.productForm.image.length ;i++)
            {
                if( parseInt( this.productForm.image[i].profile ) == 1  )
                this.productForm.profile_selected = i;
                
                this.selected_image.push(this.productForm.image[i].image );
            }
            this.getCategory();
            console.log(this.productForm);
            
        }
        
        
        toggle:any;
        save_button_disabled:boolean=false;
        saveProduct(form:any) {
            
            this.savingData = true;
            this.loading_list=true;
            this.save_button_disabled=true
            console.log(this.products);
            
            if(this.products.id){
                this.productForm.edit_product_id = this.products.id ? this.products.id : "";
            }
            console.log(this.productForm);
            
            this.productForm.image= this.selected_image ? this.selected_image : []
            this.productForm.created_by = this.db.datauser.id;
            this.db.post_rqst( { 'product' : this.productForm }, 'master/addProduct')
            .subscribe( d => {
                this.savingData = false;
                console.log( d );
                if(d['status'] == 'EXIST' )
                {
                    this.dialog.error( 'This Product Already exists');
                    return;
                }
                this.productForm = {};
                this.toggle = "false"
                this.selected_image=[];
                this.save_button_disabled=false;
                this.router.navigate(['products-list']);
                this.dialog.success( 'Product successfully save');
                this.getProductList();
            });
        }
        
        // onUploadChange(evt: any) {
            
        //     for(let i=0;i<evt.target.files.length;i++)
        //     {
        //         const file = evt.target.files[i];
        //         if (file) {
        //             const reader = new FileReader();
        //             reader.onload = this.handleReaderLoaded.bind(this);
        //             reader.readAsBinaryString(file);
        //         }
        //     }
        // }

        onUploadChange(data: any)
        {
            for(let i=0;i<data.target.files.length;i++)
            {
                let files = data.target.files[i];
                if (files) 
                {
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.selected_image.push(e.target.result);
                    }
                    reader.readAsDataURL(files);
                }
                this.image.append(""+i,data.target.files[i],data.target.files[i].name);
            }
        }
        
        
        // handleReaderLoaded(e) {
        //     this.selected_image.push('data:image/png;base64,' + btoa(e.target.result) );
        //     console.log( this.selected_image  );
        // }
        deleteProductImage(index)
        {
            this.selected_image.splice(index,1)
        }
        active:any='';
        
        ProductProfile(index)
        {
            this.active=index;
            //console.log(this.active);
            
            this.productForm.profile_selected=index;
            //console.log(this.productForm.profile_selected);
        }
        
        addProduct()
        {
            this.selected_image=[];
            this.productForm={};
            //console.log("dscds");
            
        }
        removeImage()
        {
            this.selected_image=[];
        }
        
        deleteProduct(id) {
            this.dialog.delete('Product').then((result) => {
                if(result) {
                    this.db.post_rqst({product_id : id}, 'master/productDelete')
                    .subscribe(d => {
                        //console.log(d);
                        this.getProductList();
                        this.dialog.successfully();
                    });
                }
            });
        } 
        //   });
        // } 
        
        // ProductsStatus(id) {
        //   // this.dialog.delete('Karigar').then((result) => {
        //   //   if(result) {
        //     // let id;
        //       this.db.post_rqst({product_id : id}, 'master/productStatus')
        //         .subscribe(d => {
        //           //console.log(d);
        //           this.getProductList();
        //         });
        //      }
        // //   });
        // // } 
        
        updateStatus(i,event)
        {
            //console.log(event);
            //console.log(event.checked);
            if(event.checked == false)
            {
                //console.log('false');
                
                const dialogRef = this.alrt.open(DeactiveStatusComponent,
                    {
                        width: '1024px',
                        
                        
                        data: {
                            'id' :this.products[i].id,
                            'type':'product',
                            'checked' : event.checked,
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        //console.log(`Dialog result: ${result}`);
                        if( result ){
                            this.getProductList();
                        }
                        this.getProductList();
                    });
                }
                else if(event.checked == true)
                {
                    this.db.post_rqst({'checked' : event.checked, 'id' : this.products[i].id,'login_id':this.db.datauser.id}, 'master/productStatus')
                    .subscribe(d => {
                        //console.log(d);
                        this.dialog.success( 'Status Change successfully ');
                        this.getProductList();
                    });
                }
            }
            
            
            checkNewArival(event)
            {
                console.log(event);
                console.log(event.checked);
                if(event.checked == true)
                {
                    this.productForm.latest = '1';
                    
                }
                else{
                    this.productForm.latest = '0';
                }
            }
            
            openDialog(id ,string ) 
            {
                const dialogRef = this.alrt.open(
                    ProductImageModuleComponent,
                    {            
                        data: 
                        {
                            'id' : id,
                            'mode' : string,
                        }
                    });
                    
                    dialogRef.afterClosed()
                    .subscribe((result) => {
                        //console.log(`Dialog result: ${result}`);
                    });
                    
                }
                
                numeric_Number(event: any) {
                    const pattern = /[0-9\+\-\ ]/;
                    let inputChar = String.fromCharCode(event.charCode);
                    if (event.keyCode != 8 && !pattern.test(inputChar)) {
                        event.preventDefault();
                    }
                }
                
                exportproductList()
                {
                    this.filter.mode = 1;
                    this.db.post_rqst({'filter': this.filter , 'login':this.db.datauser},'master/exportproductList')
                    .subscribe( d => {
                        this.filter.mode = 0;
                        document.location.href = this.db.myurl+'/app/uploads/exports/ProductList.csv';
                        //console.log(d);
                    });
                }
                
                upload(evt: any) {
                    
                    for(let i=0;i<evt.target.files.length;i++)
                    {
                        console.log(evt.target.files);
                        
                        const file = evt.target.files[i];
                        if (file) {
                            const reader = new FileReader();
                            this.image_name.push(file.name);
                            reader.onload = this.push_image.bind(this);
                            reader.readAsBinaryString(file);
                        }
                    }
                }
                
                image_name :any = [];
                images :any = [];
                push_image(e) {
                    this.images.push('data:image/png;base64,' + btoa(e.target.result));
                    console.log( this.images  );
                }
                
                bulk_upload(form:any)
                {
                    console.log(this.images);
                    this.savingData = true;
                    
                    this.db.post_rqst({"image":this.images,"image_name":this.image_name},'master/product_bulk_image')
                    .subscribe(resp=>{
                        console.log(resp);
                        if(resp)
                        {
                            this.productForm = {};
                            this.toggle = "false"
                            this.image_name=[];
                            this.images=[];
                            this.router.navigate(['products-list']);
                            this.dialog.success( "Done");
                            this.getProductList();
                        }
                    })
                }

                priceModel(): void {
                    const dialogRef = this.dialogs.open(ChangePriceModelComponent, {
                      width: '500px',
                      data: {}
                    });
                
                    dialogRef.afterClosed().subscribe(result => {
                      console.log('The dialog was closed');
                    });
                  }
            }
          