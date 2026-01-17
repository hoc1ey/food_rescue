
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "route": "/donor/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/beneficiary/dashboard"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1227, hash: '0cb91a0744311533e2dd9053b72fd4e88e8515386dd27d7be521b26b32dba16a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1005, hash: '70047547f98ffee2fa50147678dae63bf2c1262cb256da402b7f356e149106c5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 7713, hash: '6904e7e47e2ab6033ca2a615f3546cecff747b4750fed3f678a76668e92ac4ff', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 10237, hash: 'b9f95f496cd31c914066f424f5b910434ed33570662a06402f13b1d50bf10787', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'donor/dashboard/index.html': {size: 16925, hash: 'e65a2517016f8c5b0b67783a0ae469175dcdfbb4e1d6b70f37a8c44885bad93e', text: () => import('./assets-chunks/donor_dashboard_index_html.mjs').then(m => m.default)},
    'beneficiary/dashboard/index.html': {size: 15844, hash: '270e645462970ad65690894b6c6a9d67b97688c374cffbfabdc933a090800ec4', text: () => import('./assets-chunks/beneficiary_dashboard_index_html.mjs').then(m => m.default)},
    'styles-RUYN2QPK.css': {size: 2081, hash: 'EILHKzWw2bw', text: () => import('./assets-chunks/styles-RUYN2QPK_css.mjs').then(m => m.default)}
  },
};
