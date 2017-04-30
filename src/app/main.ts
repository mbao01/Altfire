import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import config from '../../www/env.json';
import {enableProdMode} from "@angular/core";

if(config.ENV === 'production'){
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
