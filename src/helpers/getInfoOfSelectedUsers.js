export const getFioApproveIDsArr = (selected) => {
  const fioApproveIDsArr = [];

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

export const getFioLockIDsArr = (selected) => {
  const fioLockIDsArr = [];

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
export const getFioUnlockIDsArr = (selected) => {
  const fioUnlockIDsArr = [];

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
