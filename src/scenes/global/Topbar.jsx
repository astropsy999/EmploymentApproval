import { Box, IconButton, useTheme } from '@mui/material';
import React, { useContext, useRef } from 'react';
import DivFilterMono from '../../filters/DivFilterMono';
import ObjectFilterMono from '../../filters/ObjectFilterMono';
import TypeFilterMono from '../../filters/TypeFilterMono';
import { DatePicker } from '../../helpers/datePicker';
import { useRange } from '../../store/dataStore';
import { ColorModeContext, tokens } from '../../theme';
import Button from '@mui/material/Button';
import { SiMicrosoftexcel } from 'react-icons/si';
import 'ag-grid-enterprise';
import { transformDateYY } from '../../helpers/datesRanges';
import { useGGridStore } from '../../store/dataStore';
import SubTypeFilter from '../../filters/SubTypeFilter';

const Topbar = () => {
  const { ggridRef } = useGGridStore();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const {
    objectsArr,
    typesArr,
    divesArr,
    startDate,
    endDate,
    filteredObj,
    filteredType,
    filteredDiv,
    subTypesArr,
  } = useRange();

  const onBtExport = () => {
    ggridRef.exportDataAsExcel(exportParams);
  };

  const exportParams = {
    processCellCallback: function (params) {
      if (!params.value) {
        return '';
      }
      if (
        params.value &&
        params.value !== '' &&
        typeof params.value !== 'number'
      ) {
        var cellValue = params.value
          .replace(/<div class="timeWrapper v-badge">([\d.]+)<\/div>/g, '   $1')
          .replace(/(<div class="typeWrapperVisible">)/g, '  $1  ')
          .replace(/(<div class="subTypeWrapperVisible">)/g, ' $1) ')
          .replace(/<br><div class="typeWrapper divWrapper">.*<\/div>/, '')
          .replaceAll(/<div class="typeWrapper">(.*?)<\/div>(?!<\/div>)/g, '  ')
          .replace('undefined', '');
        var cellElement = document.createElement('div');
        cellElement.innerHTML = cellValue;
        return cellElement.textContent;
      }
      if (params.node.group) {
        return '';
      } else {
        var cellValue = params.value;
        var cellElement = document.createElement('div');
        cellElement.innerHTML = cellValue;
        if (cellElement.querySelector('.timeWrapper')) {
          cellElement.querySelector('.timeWrapper').style.fontWeight = 'bold';
        }
        return cellElement.textContent;
      }
    },
    fileName: `Сводная занятость ${startDate && transformDateYY(startDate)}-${
      endDate && transformDateYY(endDate)
    } ${filteredObj.replace('Все объекты', '')} ${filteredType.replace(
      'Все работы',
      '',
    )} ${filteredDiv.replace('Все отделы', '')}.xlsx`,
  };
  return <DatePicker />;
};

export default Topbar;
