import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ProductImageModuleComponent } from '../product-image-module/product-image-module.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-productcategory-list',
  templateUrl: './productcategory-list.component.html',
})
export class ProductcategoryListComponent implements OnInit {
  
  // toggle = false;
  savingData = false;
  category: any = {};
  loading_list = false;
  total_categories:any = 0;
  categories:any =[];
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public dialog: DialogComponent, public alrt:MatDialog) {}
    
    ngOnInit() {
      this.getCategoryList();
      this.getMainCategory();
      this.category.image = [];
    }
    
    last_page: number ;
    current_page = 1;
    search: any = '';
    source: any = '';
    searchData = true;
    isInvoiceDataExist = false;
    filter:any = {};
    filtering : any = false;
    
    redirect_previous() {
      this.current_page--;
      this.getCategoryList();
    }
    redirect_next() {
      if (this.current_page < this.last_page) { this.current_page++; }
      else { this.current_page = 1; }
      this.getCategoryList();
    }
    toggle:any;
    editCategory(id,index){
      //console.log(id);
      //console.log(index)
      this.category = this.categories.filter( x => x.id==id)[0];
      this.category.profile_selected = 0;
      
      this.selected_image = [];
      for(let i=0;i<this.category.image.length;i++)
      {
        //console.log( this.category.image[i].profile );
        
        if( parseInt( this.category.image[i].profile ) == 1  )
        {
          //console.log(i);
          
          this.category.profile_selected = i;
        }
        this.selected_image.push(this.category.image[i].image);
      }
      //console.log(this.selected_image);
      //console.log(this.category);
      
    }
    savecategory(form:any) {
      //console.log(this.category.id);
      this.savingData = true;
      if(this.category.id){
        this.category.edit_cat_id = this.category.id;
      }
      this.category.created_by = this.db.datauser.id;
      
      this.category.image = this.selected_image ? this.selected_image : [];
      this.db.insert_rqst( { 'category' : this.category ,'created_by':this.db.datauser.id }, 'master/addCategory')
      .subscribe( d => {
        this.savingData = false;
        //console.log( d );
        if(d['status'] == 'EXIST' ){
          this.dialog.error( 'This Category Already exists');
          return;
        }
        this.toggle = "false";
        this.selected_image=[];
        //console.log(this.selected_image);
        
        this.router.navigate(['productcategory-list']);
        this.dialog.success( 'Category successfully save');
        this.getCategoryList();
      });
    }
    
    addCategory()
    {
      this.category={};
      this.selected_image=[];
      //console.log("dscds");
      
    }
    
    catdata:any='';
    
    
    getData:any = {};
    
    getCategoryList() {
      //console.log(this.db.datauser);
      
      this.loading_list = true;
      if( this.filter.date || this.filter.location_id )this.filtering = true;
      this.db.post_rqst({ 'filter': this.filter}, 'master/categoryList' )
      .subscribe(d => {
        //console.log(d);
        
        this.loading_list = false;
        //console.log(this.loading_list);
        
        
        this.categories = d.categories;
        // this.selected_image=d.categories.image;
        
        //console.log( this.categories );
        
      });
    }
    
    
    onUploadChange(evt: any) {
      //console.log( evt.target.files );
      
      for(let i=0;i<evt.target.files.length;i++)
      {
        const file = evt.target.files[i];
        //console.log(file);
        if (file) {
          const reader = new FileReader();
          reader.onload = this.handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
        }
      }
    }
    
    selected_image :any = [];
    handleReaderLoaded(e) {
      this.selected_image.push('data:image/png;base64,' + btoa(e.target.result) );
      
    }
    
    deleteProduct(id) {
      this.dialog.delete('Category').then((result) => {
        if(result) {
          this.db.post_rqst({category_id : id}, 'master/categoryDelete')
          .subscribe(d => {
            console.log(d);
            this.getCategoryList();
            this.dialog.successfully();
          });
        }
      });
    } 
    
    deleteProductImage(index)
    {
      this.selected_image.splice(index,1)
    }
    active:any='';
    ProductProfile(index)
    {
      this.active=index;
      this.category.profile_selected=index;
    }
    openDialog(id ,string ) {
      
      const dialogRef = this.alrt.open(ProductImageModuleComponent,
        
        {
          width: '1024px',
          data: {
            'id' : id,
            'mode' : string,
          }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          //console.log(`Dialog result: ${result}`);
        });
        
      }
      clearData()
      {
        //console.log('close');
        this.selected_image=[];
      }
      
      ma_category:any=[];
      getMainCategory()
      {
        // this.loading_list = true;
        this.db.post_rqst(  { 'filter': this.filter}, 'master/mainCategoryForProduct')
        .subscribe(d => {
          //console.log(d);
          this.ma_category = d.category;
          //console.log(this.category);
          // this.loading_list = false;
        });
      }
      
      
      exportproductCategory()
      {
        this.filter.mode = 1;
        this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'master/exportproductCategory')
        .subscribe( d => {
          document.location.href = this.db.myurl+'/app/uploads/exports/ProductCategory.csv';
          //console.log(d);
        });
      }
      
      
    }
    