// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';


const baseUrl= "https://buimat.com/api/"
export const environment = {
  production      : false,
  version         : packageInfo.version,
  appName         : 'BUIMAT',
  envName         : EnvName.LOCAL,
  defaultLanguage : 'en',
  apiBaseUrl      : baseUrl,
  
};
