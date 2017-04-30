import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';

import * as Altfire from './app.component';
import {RestfulService} from "../services/restful.service";
import {FormsModule} from "@angular/forms";
import {GraphqlHTTPClient} from "../services/graphql.service";
import {AuthService} from "../services/auth.service";
import {IonicStorageModule} from "@ionic/storage";
import {NativeStorage} from "@ionic-native/native-storage";
import {StorageService} from "../services/storage.service";
import {FirebaseService} from "../services/firebase.service";
import {HelperService} from "../services/helpers";

@NgModule({
    declarations: [
        Altfire.Entry,
        Altfire.HomePage,
        Altfire.TabsPage,
        Altfire.GraphqlPage,
        Altfire.RestfulPage,
        Altfire.AuthPage,
        Altfire.SettingsPage,
        Altfire.SigninModal,
        Altfire.RequestHeaderComponent,
        Altfire.RequestBodyComponent,
        Altfire.RequestAuthorizationComponent,
        Altfire.PopoverComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(Altfire.Entry),
        IonicStorageModule.forRoot(),
        HttpModule,
        FormsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        Altfire.Entry,
        Altfire.HomePage,
        Altfire.TabsPage,
        Altfire.GraphqlPage,
        Altfire.RestfulPage,
        Altfire.AuthPage,
        Altfire.SettingsPage,
        Altfire.SigninModal,
        Altfire.PopoverComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        RestfulService,
        GraphqlHTTPClient,
        AuthService,
        StorageService,
        NativeStorage,
        FirebaseService,
        HelperService
    ]
})
export class AppModule {
}
