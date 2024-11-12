// src/components/DateCheckboxGroup.tsx

import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DateCheckboxGroupProps {
  dates: Date[]; // Массив дат для отображения
  checkedDates: { [key: string]: boolean }; // Объект с состояниями чекбоксов
  onChange: (dateKey: string) => void; // Функция обработки изменения состояния чекбокса
}

/**
 * Компонент для отображения группы чекбоксов дат.
 *
 * @param dates - Массив дат для отображения.
 * @param checkedDates - Объект, где ключи - даты в формате ISO, а значения - булевы флаги выбора.
 * @param onChange - Функция, вызываемая при изменении состояния чекбокса.
 * @returns JSX.Element
 */
const DateCheckboxGroup: React.FC<DateCheckboxGroupProps> = ({
  dates,
  checkedDates,
  onChange,
}) => {
  return (
    <FormGroup row sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {dates.map((date) => {
        const dateKey = date.toISOString();
        // Используем двухбуквенные сокращения дней недели
        const dayOfWeek = format(date, 'EEEEEE', { locale: ru });
        const dayAndMonth = format(date, 'dd');

        return (
          <FormControlLabel
            key={dateKey}
            control={
              <Checkbox
                checked={checkedDates[dateKey] || false}
                onChange={() => onChange(dateKey)}
                sx={{
                  paddingRight: '1px',
                }}
              />
            }
            label={`${dayOfWeek} ${dayAndMonth}`}
            sx={{
              marginRight: 1, // Уменьшаем отступ между чекбоксами
              '.MuiFormControlLabel-label': {
                fontSize: '0.85rem', // Уменьшаем размер шрифта, если нужно
                marginLeft: '4px', // Уменьшаем отступ между чекбоксом и текстом
              },
              marginLeft: 0,
            }}
          />
        );
      })}
    </FormGroup>
  );
};

export default DateCheckboxGroup;
