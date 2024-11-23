// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';
// const baseUrl = scheme + host + port + path;
const baseUrl= "https://buimat.com/api/"
export const environment = {
  production      : false,
  version         : packageInfo.version,
  appName         : 'BUIMAT',
  envName         : EnvName.LOCAL,
  defaultLanguage : 'en',
  apiBaseUrl      : baseUrl,
  googleMapsApiKey:'AIzaSyAFgWIwFy3WCbWNNSaJJlIg372zDn_k4VE',
  payment         : 'easebuzz',
  // firebase: {
  //   apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //   authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //   projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //   storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //   messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  //   appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  // }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
