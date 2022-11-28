import { Crypto } from './_Pipes/Crypto.pipe';
import { DatePikerFormat } from './_Pipes/DatePikerFormat.pipe';
import { AuthGuard } from './_guards/AuthGuard';
import { AuthGuardLog } from './_guards/AuthGuardLog';
import { DatabaseService } from './_services/DatabaseService';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { MatVideoModule } from 'mat-video';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ReferralMasterComponent } from './master/referral-master/referral-master.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import 'hammerjs';
import { AgmCoreModule } from '@agm/core';

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatTooltipModule} from '@angular/material';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {MatIconModule} from '@angular/material/icon';
import {MaterialModule} from './material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeaderComponent} from './header/header.component';
import {OfferListComponent } from './offer/offer-list/offer-list.component';
import {AddOfferComponent } from './offer/add-offer/add-offer.component';
import {OfferDetailComponent } from './offer/offer-detail/offer-detail.component';
import {GiftRedeemModuleComponent } from './offer/gift-redeem-module/gift-redeem-module.component';
import {TransferCodeComponent } from './offer/transfer-code/transfer-code.component';
import {GiftListComponent } from './gift-gallery/gift-list/gift-list.component';
import {GiftDetailComponent } from './gift-gallery/gift-detail/gift-detail.component';
import {ProductcategoryListComponent } from './master/productcategory-list/productcategory-list.component';
import {ProductsListComponent } from './master/products-list/products-list.component';
import {VideoComponent } from './master/video/video.component';
import {ChangeStatusComponent } from './gift-gallery/change-status/change-status.component';
import {KarigarListComponent } from './karigar/karigar-list/karigar-list.component';
import {KarigarAddComponent } from './karigar/karigar-add/karigar-add.component';
import {KarigarDetailComponent } from './karigar/karigar-detail/karigar-detail.component';
import {CouponDetailsComponent } from './karigar/coupon-details/coupon-details.component';
import {CouponCodeListComponent } from './coupon-codes/coupon-code-list/coupon-code-list.component';
import { VideoSafe } from './_Pipes/VideoSafe.pipe';
import { ProductImageModuleComponent } from './master/product-image-module/product-image-module.component';
import { EditOfferComponent } from './offer/edit-offer/edit-offer.component';
import { ChangeKarigarStatusComponent } from './karigar/change-karigar-status/change-karigar-status.component';
import { ImportStatusModelComponent } from './offer/import-status-model/import-status-model.component';
import { KarigarBalanceModelComponent } from './karigar/karigar-balance-model/karigar-balance-model.component';
import { EditGiftComponent } from './offer/edit-gift/edit-gift.component';
import { DeactiveStatusComponent } from './deactive-status/deactive-status.component';
import { KarigarDetailModuleComponent } from './master/karigar-detail-module/karigar-detail-module.component';
import { SliderComponent } from './slider/slider.component';
import { ReopenRemarkModleComponent } from './offer/reopen-remark-modle/reopen-remark-modle.component';
import { SuperComponent } from './super/super.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ComplaintsAddComponent } from './complaints/complaints-add/complaints-add.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { ComplaintsChangeStatusComponent } from './complaints/complaints-change-status/complaints-change-status.component';
import { ComplaintsDetailComponent } from './complaints/complaints-detail/complaints-detail.component';
import { LoginBannerComponent } from './master/login-banner/login-banner.component';
import { ComplaintsNatureProblemComponent } from './complaints/complaints-nature-problem/complaints-nature-problem.component';
import { ComplaintsAssignPlumberComponent } from './complaints/complaints-assign-plumber/complaints-assign-plumber.component';
import { CouponCodeUploadComponent } from './coupon-codes/coupon-code-upload/coupon-code-upload.component';
import { ComplaintsEditGalleryComponent } from './complaints/complaints-edit-gallery/complaints-edit-gallery.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { ComplaintRemarkComponent } from './complaints/complaint-remark/complaint-remark.component';
import { RegistrationLoyalityComponent } from './master/registration-loyality/registration-loyality.component';
import { MainCategoryComponent } from './master/main-category/main-category.component';

import { FusionChartsModule } from 'angular-fusioncharts';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { CategoryModelComponent } from './master/category-model/category-model.component';
import { SpecialDiscountComponent } from './master/special-discount/special-discount.component';

import { ChangePriceModelComponent } from './master/change-price-model/change-price-model.component';
import { RedeemRequestListComponent } from './redeem-request/redeem-request-list/redeem-request-list.component';
import { RedeemRequestDetailComponent } from './redeem-request/redeem-request-detail/redeem-request-detail.component';
import { ShippedDetailModelComponent } from './redeem-request/shipped-detail-model/shipped-detail-model.component';
import { ChangeStatusRedeemComponent } from './redeem-request/change-status-redeem/change-status-redeem.component';
import {BrowserModule} from "@angular/platform-browser";
import { PopupComponent } from './popup/popup.component';
import { PlumberMeetDataComponent } from './plumber-meet-data/plumber-meet-data.component';
import { ComplaintRemarkModalComponent } from './complaints/complaint-remark-modal/complaint-remark-modal.component';

import {MatDialogModule} from '@angular/material/dialog';
import { AddCouponPointsComponent } from './add-coupon-points/add-coupon-points.component'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteAddComponent } from './site-add/site-add.component';
import { SalesUserListComponent } from './sales-user-list/sales-user-list.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';
import { CouponAddComponent } from './coupon-add/coupon-add.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeAddComponent } from './scheme-add/scheme-add.component';
import { CouponCodeDataListComponent } from './coupon-code-data-list/coupon-code-data-list.component';
import { CouponCodeDataDetailComponent } from './coupon-code-data-detail/coupon-code-data-detail.component';
import { SchemeDetailComponent } from './scheme-detail/scheme-detail.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { SubCategoryListComponent } from './sub-category-list/sub-category-list.component';
import { SaleTeamDetailComponent } from './sale-team-detail/sale-team-detail.component';
import { GiftMasterComponent } from './gift-master/gift-master.component';
import { ManualGiftListComponent } from './manual-gift-list/manual-gift-list.component';
import { ManualGiftAddComponent } from './manual-gift-add/manual-gift-add.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

const routes: Routes = [
  {path: '', component: LoginComponent , canActivate: [AuthGuardLog] },
  {path: 'dashboard', component: DashboardComponent  , canActivate: [AuthGuard] },
  {path: 'offer-list', component: OfferListComponent  , canActivate: [AuthGuard] },
  {path: 'add-offer', component: AddOfferComponent , canActivate: [AuthGuard] },
  {path: 'edit-offer/:offer_id', component: EditOfferComponent , canActivate: [AuthGuard] },
  {path: 'offer-detail/:offer_id', component: OfferDetailComponent , canActivate: [AuthGuard] },
  {path: 'gift-list', component: GiftListComponent , canActivate: [AuthGuard] },
  {path: 'gift-detail/:gift_id', component: GiftDetailComponent , canActivate: [AuthGuard] },
  {path: 'productcategory-list', component: ProductcategoryListComponent , canActivate: [AuthGuard] },
  {path: 'products-list', component: ProductsListComponent , canActivate: [AuthGuard] },
  {path: 'main-catefory-list', component: MainCategoryComponent , canActivate: [AuthGuard] },
  {path: 'sub-category-list', component: SubCategoryListComponent , canActivate: [AuthGuard] },
  {path: 'registration-loyality', component: RegistrationLoyalityComponent , canActivate: [AuthGuard] },
  {path: 'video-list', component: VideoComponent , canActivate: [AuthGuard] },
  {path: 'referral-master', component: ReferralMasterComponent , canActivate: [AuthGuard] },
  {path: 'special-dis', component: SpecialDiscountComponent , canActivate: [AuthGuard] },
  {path: 'site-add/:id', component:SiteAddComponent , canActivate: [AuthGuard] },
  {path: 'site-add', component:SiteAddComponent , canActivate: [AuthGuard] },
  {path: 'schemeList', component:SchemeListComponent , canActivate: [AuthGuard] },
  {path: 'schemeAdd', component:SchemeAddComponent, canActivate: [AuthGuard] },
  {path: 'schemeAdd/:id', component:SchemeAddComponent, canActivate: [AuthGuard] },
  {path: 'schemeDetail/:id', component:SchemeDetailComponent, canActivate: [AuthGuard] },

  {path: 'contractor-list', component: KarigarListComponent , canActivate: [AuthGuard] },
  {path: 'karigar-add', component: KarigarAddComponent , canActivate: [AuthGuard] },
  {path: 'karigar-add/:karigar_id', component: KarigarAddComponent , canActivate: [AuthGuard] },
  {path: 'karigar-detail/:karigar_id',  component: KarigarDetailComponent , canActivate: [AuthGuard] },
  // {path: 'coupon-code-list',  component: CouponCodeListComponent , canActivate: [AuthGuard] },
  {path: 'coupon-code-list',  component: CouponCodeDataListComponent , canActivate: [AuthGuard] },
  {path: 'coupon-code-Detail/:id',  component: CouponCodeDataDetailComponent , canActivate: [AuthGuard] },
  {path: 'coupon-code-add',  component: CouponAddComponent , canActivate: [AuthGuard] },
  {path: 'super-list', component: SuperComponent , canActivate: [AuthGuard] },
  {path: 'site-list/:page', component: SiteListComponent , canActivate: [AuthGuard] },
  {path: 'site-detail/:id/:page', component:SiteDetailComponent, canActivate: [AuthGuard] },
  {path: 'complaints-list/:type', component: ComplaintsComponent, canActivate: [AuthGuard] },
  {path: 'architect-list', component: CustomerComponent, canActivate: [AuthGuard] },
  {path: 'gift-master-list', component: GiftMasterComponent, canActivate: [AuthGuard] },
  {path: 'manual-gift-list', component: ManualGiftListComponent, canActivate: [AuthGuard] },
  {path: 'customer-detail/:customer_id',  component: CustomerDetailComponent , canActivate: [AuthGuard] },
  {path: 'complaints-add/main/:type', component: ComplaintsAddComponent , canActivate: [AuthGuard] },
  {path: 'complaints-add/:complaints_id', component: ComplaintsAddComponent , canActivate: [AuthGuard] },
  {path: 'complaints-detail/:complaints_id',  component: ComplaintsDetailComponent , canActivate: [AuthGuard] },
  {path: 'login-banner-list', component: LoginBannerComponent , canActivate: [AuthGuard] },
  {path: 'coupon-upload', component: CouponCodeUploadComponent , canActivate: [AuthGuard] },
  {path: 'customer-edit/:customer_id', component: CustomerEditComponent , canActivate: [AuthGuard] },
  {path: 'plumber-meet-data', component: PlumberMeetDataComponent , canActivate: [AuthGuard] },
  {path: 'user-list/:page', component:SalesUserListComponent , canActivate: [AuthGuard] },
  {path: 'user-detail/:id', component:SaleTeamDetailComponent , canActivate: [AuthGuard] },


  

  {path: 'popup', component: PopupComponent, canActivate: [AuthGuard]},

  {path: 'redeem-request-list', component: RedeemRequestListComponent , canActivate: [AuthGuard] },
  {path: 'redeem-request-detail/:redeem_id', component: RedeemRequestDetailComponent , canActivate: [AuthGuard] },

  {path: 'slider',  component: SliderComponent},
  { path: '**', redirectTo: ''},




];


@NgModule({
  declarations: [
    RedeemRequestListComponent,
    ChangeStatusRedeemComponent,
    RedeemRequestDetailComponent,
    ShippedDetailModelComponent,
    DialogComponent,
    Crypto,
    VideoSafe,
    DatePikerFormat,
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    OfferListComponent,
    AddOfferComponent,
    OfferDetailComponent,
    GiftRedeemModuleComponent,
    ProductImageModuleComponent,
    TransferCodeComponent,
    GiftListComponent,
    GiftDetailComponent,
    ProductcategoryListComponent,
    ProductsListComponent,
    VideoComponent,
    ChangeStatusComponent,
    KarigarListComponent,
    KarigarAddComponent,
    KarigarDetailComponent,
    CouponDetailsComponent,
    CouponCodeListComponent,
    ProductImageModuleComponent,
    EditOfferComponent,
    ChangeKarigarStatusComponent,
    ImportStatusModelComponent,
    KarigarBalanceModelComponent,
    EditGiftComponent,
    DeactiveStatusComponent,
    KarigarDetailModuleComponent,
    SliderComponent,
    ReopenRemarkModleComponent,
    SuperComponent,
    ComplaintsComponent,
    ComplaintsAddComponent,
    CustomerComponent,
    CustomerDetailComponent,
    ComplaintsChangeStatusComponent,
    ComplaintsDetailComponent,
    LoginBannerComponent,
    ComplaintsNatureProblemComponent,
    ComplaintsAssignPlumberComponent,
    CouponCodeUploadComponent,
    ComplaintsEditGalleryComponent,
    CustomerEditComponent,
    ComplaintRemarkComponent,
    RegistrationLoyalityComponent,
    MainCategoryComponent,
    ReferralMasterComponent,
    CategoryModelComponent,
    ChangePriceModelComponent,
    SpecialDiscountComponent,
    PopupComponent,
    SiteListComponent,
    PlumberMeetDataComponent,
    ComplaintRemarkModalComponent,
    AddCouponPointsComponent,
    SiteAddComponent,
    SalesUserListComponent,
    SiteDetailComponent,
    CouponAddComponent,
    SchemeListComponent,
    SchemeAddComponent,
    CouponCodeDataListComponent,
    CouponCodeDataDetailComponent,
    SchemeDetailComponent,
    EditStatusComponent,
    SubCategoryListComponent,
    SaleTeamDetailComponent,
    GiftMasterComponent,
    ManualGiftListComponent,
    ManualGiftAddComponent,
  ],
  imports: [
    // AutocompleteLibModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBZ4zXanVSs4A1kSVIDCIzDqtMbk6Tv3bg'
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
    }),
    MatIconModule,
    MatInputModule,
    NgxBarcodeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatVideoModule,
    NgxEditorModule,
    AngularFontAwesomeModule,
    NgxHmCarouselModule,
    FusionChartsModule,
    NgxQRCodeModule,
    MatProgressBarModule,
    MatTooltipModule,
    AutocompleteLibModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
  ],
  providers: [
    AuthGuard,
    AuthGuardLog,
    DatabaseService
  ],
  entryComponents: [
    GiftRedeemModuleComponent,
    TransferCodeComponent,
    ChangeStatusComponent,
    ShippedDetailModelComponent,
    CouponDetailsComponent,
    ProductImageModuleComponent,
    ChangeKarigarStatusComponent,
    ImportStatusModelComponent,
    KarigarBalanceModelComponent,
    ManualGiftAddComponent,
    DeactiveStatusComponent,
    KarigarDetailModuleComponent,
    EditGiftComponent,
    ReopenRemarkModleComponent,
    ComplaintsChangeStatusComponent,
    ComplaintsNatureProblemComponent,
    ComplaintsAssignPlumberComponent,
    ComplaintsEditGalleryComponent,
    ComplaintRemarkComponent,
    CategoryModelComponent,
    ChangePriceModelComponent,
    ComplaintRemarkModalComponent,
    AddCouponPointsComponent,
    EditStatusComponent,

  ],
  
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class DatepickerModule {}
