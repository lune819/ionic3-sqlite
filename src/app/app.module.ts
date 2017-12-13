import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NewPage} from '../pages/new/new';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import {SQLite} from "@ionic-native/sqlite";
import { Toast } from '@ionic-native/toast';

//photo
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {EditPage} from '../pages/edit/edit';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

import { HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewPage,
    EditPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewPage,
    EditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Camera,
    ImagePicker,
    BarcodeScanner,
    File,
    Transfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Toast
  ]
})
export class AppModule {}
