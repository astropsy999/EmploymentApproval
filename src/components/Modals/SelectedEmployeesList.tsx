// src/components/Modals/SelectedEmployeesList.tsx

import React from 'react';
import { Typography } from '@mui/material';
import { FioIdsArray } from '../../types';

export interface SelectedEmployeesListProps {
  title: string;
  employees: FioIdsArray[];

}

/**
 * Компонент для отображения списка выбранных сотрудников.
 *
 * @param employees - Массив объектов с ФИО сотрудников.
 * @returns JSX.Element
 */
const SelectedEmployeesList: React.FC<SelectedEmployeesListProps> = ({ title,employees }) => {
  return (
    <>
      <Typography gutterBottom fontSize={18}>
        {title}:
      </Typography>
      <Typography gutterBottom fontSize={16} fontWeight={'bold'}>
        {employees.map((fioObj, index, array) => (
          <span key={Object.keys(fioObj)[0]}>
            {Object.keys(fioObj)[0]}
            {index < array.length - 1 && ', '}
          </span>
        ))}
      </Typography>
    </>
  );
};

export default SelectedEmployeesList;
