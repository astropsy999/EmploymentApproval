export interface RangeState {
    startDate: Date;
    endDate: Date;
    loading: boolean;
    error: any; // Вы можете уточнить тип ошибки, если знаете его
    setStartDate: (newStartDate: Date) => void;
    setEndDate: (newEndDate: Date) => void;
    rowData: any; // Уточните тип данных, если возможно
    setRowData: (newRowData: any) => void;
    columnDefs: any; // Типизируйте в соответствии с тем, что возвращает getColumnDefs()
    setColumnDefs: (newCols: any) => void;
    objectsArr: any[]; // Уточните тип элементов массива
    setObjectsArr: (newObjArr: any[]) => void;
    filteredObj: string;
    setFilteredObj: (newFiltObj: string) => void;
    filteredType: string;
    setFilteredType: (newFiltType: string) => void;
    typesArr: any[]; // Уточните тип элементов массива
    setTypesArr: (newTypesArr: any[]) => void;
    filteredSubType: string;
    setFilteredSubType: (newFiltSubType: string) => void;
    subTypesArr: any[]; // Уточните тип элементов массива
    setSubTypesArr: (newSubTypesArr: any[]) => void;
    filteredDiv: string;
    setFilteredDiv: (newFiltDiv: string) => void;
    divesArr: any[]; // Уточните тип элементов массива
    setDivesArr: (newDivesArr: any[]) => void;
    filterString: string;
    setFilterString: (newFilterString: string) => void;
    eventsDataFioObj: any; // Уточните тип объекта
    setEventsDataFioObj: (newEventsDataFioObj: any) => void;
    eventsDataFioObjAll: any; // Уточните тип объекта
    setEventsDataFioObjAll: (newEventsDataFioObjAll: any) => void;
    typesSubtypesBase: Record<string, any>; // Уточните тип объекта
    setTypesSubtypesBase: (newTypesSubtypesBase: Record<string, any>) => void;
    initialLoadedSubtypes: any[]; // Уточните тип элементов массива
    setInitialLoadedSubtypes: (newInitialLoadedSubtypes: any[]) => void;
    isMessageColumnVisible: boolean;
    setMessageColumnVisible: (newMessageColumnVisible: boolean) => void;
}

export interface GGridStoreState {
    ggridRef: any; // Уточните тип, если возможно
    setGGridRef: (ref: any) => void;
    getGGridRef: () => any;
}

export interface FiltersState {
    linkedAndFilteredUsers: any[]; // Уточните тип элементов массива
    setLinkedAndFilteredUsers: (newLinkedAndFilteredUsers: any[]) => void;
}

export interface IDsState {
    namesIddbObj: Record<string, any>; // Уточните тип значения, если возможно
    setNamesIddbObj: (newNamesIddbObj: Record<string, any>) => void;
    namesDatesDayIDsObj: Record<string, any>; // Уточните тип значения
    setNamesDatesDayIDsObj: (newNamesDatesDayIDsObj: Record<string, any>) => void;
    lockedDates: Record<string, any>; // Уточните тип значения
    setLockedDates: (newLockedDates: Record<string, any>) => void;
    usersSavedMessagesDates: Record<string, any>; // Уточните тип значения
    setUsersSavedMessagesDates: (newUsersSavedMessagesDates: Record<string, any>) => void;
}


