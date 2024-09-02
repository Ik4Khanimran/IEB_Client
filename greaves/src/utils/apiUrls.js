// apiUrls.js 

const MAIN_DOMAIN = 'http://127.0.0.1:8000';
 //const MAIN_DOMAIN = 'http://localhost:81';
// const MAIN_DOMAIN = 'http://10.24.0.104:81';
// const MAIN_DOMAIN = 'http://localhost:8000';

const APP_NAMES = {
  ATP: 'ATP',
  User: 'User',
  Common: 'Common',
  Dashboard: 'Dashboard',
  Operations : 'Operations'
};

export const LOGIN_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/login/`;
export const DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_checksheet/`;
export const CHECKSHEET_FORM2_SUBMIT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/checksheet_data/`;
export const CHECKSHEET_RESULT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/engine_checksheet_result/`;
export const DATABASE_CON_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/database_connection/`;
export const DATA_DELETE_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/data_delete/`;
export const DATA_EDIT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/data_edit/`;
export const NEW_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/data_new_entry/`;
export const SAVE_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/save_new_entry/`;
export const CHECKSHEET_DROPDOWNVALUE_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/get_drdwn_val/`;
export const DATABASE_USER_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/usertable/`;
export const USER_DATA_DELETE_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/createusertable/`;
export const USER_NEW_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/createusertable/`;
export const SAVE_USER_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/save_new_entry/`;
export const HOME_GET_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.Dashboard}/get_data/`;
export const AUDIT_REMARK_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/audit_checksheet/`;
export const OPN_CHECKSHEET_AUDIT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_audit_checksheet/`;
export const REWORK_REMARK_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/rework_checksheet/`;
export const OPN_CHECKSHEET_REWORK_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_rework_checksheet/`;
export const GET_ESN_DETAIL_URL = `${MAIN_DOMAIN}/${APP_NAMES.Operations}/get_esn_data/`;
export const UPDATE_LOCATION_URL = `${MAIN_DOMAIN}/${APP_NAMES.Operations}/update_location/`;
export const OPEN_OPS_ST10_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_ops_st10/`;
export const SUBMIT_OPS_ST10_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/assemblyop_submit/`;
export const GET_ASSEMBLYOP_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/get_assemblyop_result/`;
export const HOLD_OPS_ST10_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/assemblyop_hold/`;

// Add more URLs as needed