import ky from 'ky';
const srvURL = () => {
  const mode = import.meta.env.MODE;

  return mode === 'development' ? 'https://telegram.giapdc.ru:8443' : '';
};

const srv = srvURL(),
  URLS = {
    verifyLogin: '/index.php/VerifyLogin',
    createNodeUrl: '/index.php/ObjectController/CreateNode',
    getTableData: '/index.php/ObjectController/GetTableData',
    addValueObject: '/index.php/ObjectController/AddValueObject/true',
    getInheritParamsForTableUrl:
      '/index.php/UIController/GetInheritParamsForTable',
    addDopParamsUrl: '/index.php/Cache/cache_add_table',
    calcforObjecttoTable: '/index.php/ObjectController/CalcforObjecttoTable',
    calcContextValuesBTN: '/index.php/CalcsController/CalcContextValuesBTN',
    deleteNodeURL: '/index.php/ObjectController/DeleteNode',
    getEnumsData: '/index.php/ObjectController/GetEnumsData',
    delObjMassUrl: '/index.php/ObjectController/DeleteObjMass',
    addValueObjTrue: '/index.php/ObjectController/AddValueObject/true',
    getDataColumnTableForInterface:
      '/index.php/ObjectController/GetDataColumnTableForInterface',
    getReports: '/index.php/UISettingsController/GetReports',
    getreportFormodule: '/index.php/RepCalcController/GetReportForModule',
    GetExcelforCalc: '/index.php/RepCalcController/GetExcelforCalc',
    BuildWindowForm: '/index.php/UIController/BuildWindowForm',
    calcsController: '/index.php/CalcsController/CalcContextValuesBTN',
  };

export const getUseridURL = srv + URLS.getTableData;
export const addValueObjectURL = srv + URLS.addValueObject;
export const calcsController = srv + URLS.calcsController;
export const buildWindowForm = srv + URLS.BuildWindowForm;
// getTableData = async (formdata) => {
//   return await ky
//     .post(getUseridURL, {
//       body: formdata,
//       credentials: 'include',
//       timeout: false,
//     })
//     .json();
// };
