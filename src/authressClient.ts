import { LoginClient } from '@authress/login';

let loginClient: LoginClient = null;
try {
  loginClient = new LoginClient({
    // app_default is the default Authress created application.
    // * Configure the default Authress application at https://authress.io/app/#/settings?focus=applications&applicationId=app_default
    // * Create a new application at https://authress.io/app/#/settings?focus=applications
    // * Or Create an application using the quick setup flow: https://authress.io/app/#/settings?focus=quick&flow=authentication
    applicationId: 'app_default',

    // Create a custom domain: https://authress.io/app/#/settings?focus=domain (https://login.application.com)
    // * OR use the default one for your account: https://authress.io/app/#/api?route=overview (https://ACCOUNT_ID.api-region.authress.io)
    
    // https://a48copjrf5qrjn1niakfzfqlp.api-eu-west.authress.io
    authressLoginHostUrl: 'https://a48copjrf5qrjn1niakfzfqlp.login.authress.io',
  });

  loginClient.userSessionExists();
} catch (error) {
  loginClient = null;
  console.error(error);
}

export const starterKitIsConfiguredCorrectly = !!loginClient;

export const authressLoginClient = loginClient;
