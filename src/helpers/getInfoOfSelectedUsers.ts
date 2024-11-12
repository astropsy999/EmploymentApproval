export type SelectedData = {[ФИО: string]: string; }[]
export type PreparedData = { [key: string]: string[] }[]

export const getFioApproveIDsArr = (selected: SelectedData): PreparedData => {
  const fioApproveIDsArr: PreparedData = [];

  selected.forEach((obj) => {
    let fio = '';
    let objIds = [];
    let htmlStrings = '';

    for (const key in obj) {
      if (key !== 'ФИО' && obj[key]) {
        htmlStrings += obj[key];
      } else {
        fio = obj[key].split('<')[0].trim();
      }
    }
    const regex = /objID="(\d+)"/g;

    let match;
    while ((match = regex.exec(htmlStrings)) !== null) {
      objIds.push(match[1]);
    }

    fioApproveIDsArr.push({ [fio]: objIds });
  });

  return fioApproveIDsArr;
};

export const getFioLockIDsArr = (selected: SelectedData):PreparedData  => {
  const fioLockIDsArr: { [key: string]: string[] }[] = [];

  selected.forEach((obj) => {
    let fio = '';
    let objDays = Object.keys(obj).slice(1);

    for (const key in obj) {
      if (key === 'ФИО' && obj[key]) {
        fio = obj[key].split('<')[0].trim();
      }
    }

    fioLockIDsArr.push({ [fio]: objDays });
  });

  return fioLockIDsArr;
};
export const getFioUnlockIDsArr = (selected: SelectedData) => {
  const fioUnlockIDsArr: PreparedData = [];

  selected.forEach((obj) => {
    let fio = '';
    let objDays = Object.keys(obj).slice(1);

    for (const key in obj) {
      if (key === 'ФИО' && obj[key]) {
        fio = obj[key].split('<')[0].trim();
      }
    }

    fioUnlockIDsArr.push({ [fio]: objDays });
  });

  return fioUnlockIDsArr;
};
