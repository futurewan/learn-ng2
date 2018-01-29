// The file contents for the current environment will overwrite these during
// build. The build system defaults to the dev environment which uses
// `environment.ts`, but if you do `ng build --env=prod` then
// `environment.prod.ts` will be used instead. The list of which env maps to
// which file can be found in `angular-cli.json`.


export const environment: any = {
  production: false,
  env: 'dev',
  prefix: '//api.sy6.com/eurekaRoute/v263',
  // prefix:'http://10.52.2.203:9011',
  wss: 'ws://10.52.2.203:8011',
  act: 'https://act.sy6.com',
  version: 'v263'
};
