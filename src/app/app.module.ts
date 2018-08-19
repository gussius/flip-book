import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlipBookModule } from './flip-book/flip-book.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlipBookModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
