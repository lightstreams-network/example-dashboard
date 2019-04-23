import {DateFormatPipe} from "../pipes/date-format.pipe";
import {NgModule} from "@angular/core";
import {ContractCard} from "./contract-card/contract-card";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {ElipsisPipe} from "../pipes/ellipsis.pipe";
import {InputDebounceComponent} from "./input-debounce/input-debounce";
import {RouterModule} from "@angular/router";
import {PricePipe} from "./pipes/price.pipe";
import {FileSizePipe} from "./pipes/fileSize.pipe";

@NgModule({
   declarations: [
      DateFormatPipe,
      ElipsisPipe,
      ContractCard,
      InputDebounceComponent,
      PricePipe,
      FileSizePipe
   ],
   imports: [
      RouterModule,
      BrowserModule,
      FormsModule,
      HttpModule,
      MaterialModule
   ],
   exports: [
      DateFormatPipe,
      ElipsisPipe,
      ContractCard,
      InputDebounceComponent,
      PricePipe,
      FileSizePipe
   ]
})
export class CommonModule { }
