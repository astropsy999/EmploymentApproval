export const calculateTotalRow = (gridRef) => {
  const gridApi = gridRef?.current?.api;
  const columnDefs = gridApi?.getColumnDefs();

  const totalRowData = {};

  // перебираем все колонки
  columnDefs?.forEach((colDef) => {
    if (
      colDef.colId !== 'ФИО' &&
      colDef.colId !== 'СООБЩЕНИЕ' &&
      colDef.colId !== '\u03A3'
    ) {
      const fieldName = colDef.field;
      const columnValues = gridApi
        .getModel()
        .rowsToDisplay.map((rowNode) => rowNode.data[fieldName]);

      // суммируем все значения колонки

      const total = columnValues.reduce((acc, val) => {
        const regex = /<span class="factTime"><b>([\d.]+)ч<\/b><\/span>/g;
        if (val !== '' && val !== undefined) {
          const matches = val.match(regex);
          if (matches && matches.length !== 0) {
            for (const match of matches) {
              const parsedNum = parseFloat(match.match(/([\d.]+)ч/)[1]);

              if (!isNaN(parsedNum)) {
                acc += parsedNum;
              }
            }
          }
        }
        return acc;
      }, 0);

      // записываем сумму в верхнюю строку
      totalRowData[fieldName] = total;
    }
  });

  // обновляем данные верхней строки
  gridApi?.setPinnedTopRowData([totalRowData]);
};
