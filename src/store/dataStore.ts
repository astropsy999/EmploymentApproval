import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getColumnDefs } from '../data/trackerCols.data';
import { weekDatesDefault } from '../helpers/datesRanges';
import { FiltersState, GGridStoreState, IDsState, RangeState } from './dataStore.types';

export const useRange = create<RangeState>()(
  devtools((set) => ({
    startDate: weekDatesDefault()[0],
    endDate: weekDatesDefault()[1],
    loading: false,
    error: null,
    setStartDate: (newStartDate) => set({ startDate: newStartDate }),
    setEndDate: (newEndDate) => set({ endDate: newEndDate }),
    rowData: null,
    setRowData: (newRowData) => set({ rowData: newRowData }),
    columnDefs: getColumnDefs(),
    setColumnDefs: (newCols) => set({ columnDefs: newCols }),
    objectsArr: [],
    setObjectsArr: (newObjArr) => set({ objectsArr: newObjArr }),
    filteredObj: '',
    setFilteredObj: (newFiltObj) => set({ filteredObj: newFiltObj }),
    filteredType: '',
    setFilteredType: (newFiltType) => set({ filteredType: newFiltType }),
    typesArr: [],
    filteredSubType: '',
    setFilteredSubType: (newFiltSubType) =>
      set({ filteredSubType: newFiltSubType }),
    subTypesArr: [],
    setTypesArr: (newTypesArr) => set({ typesArr: newTypesArr }),
    setSubTypesArr: (newSubTypesArr) => set({ subTypesArr: newSubTypesArr }),
    filteredDiv: '',
    setFilteredDiv: (newFiltDiv) => set({ filteredDiv: newFiltDiv }),
    divesArr: [],
    setDivesArr: (newDivesArr) => set({ divesArr: newDivesArr }),
    filterString: '',
    setFilterString: (newFilterString) =>
      set({ filterString: newFilterString }),
    eventsDataFioObj: null,
    eventsDataFioObjAll: null,
    setEventsDataFioObjAll: (newEventsDataFioObjAll) =>
      set({ eventsDataFioObjAll: newEventsDataFioObjAll }),
    setEventsDataFioObj: (newEventsDataFioObj) =>
      set({ eventsDataFioObj: newEventsDataFioObj }),
    typesSubtypesBase: {},
    setTypesSubtypesBase: (newTypesSubtypesBase) =>
      set({ typesSubtypesBase: newTypesSubtypesBase }),
    initialLoadedSubtypes: [],
    setInitialLoadedSubtypes: (newInitialLoadedSubtypes) =>
      set({ initialLoadedSubtypes: newInitialLoadedSubtypes }),
    isMessageColumnVisible: false,
    setMessageColumnVisible: (newMessageColumnVisible) =>
      set({ isMessageColumnVisible: newMessageColumnVisible }),
  })),
);

export const useGGridStore = create<GGridStoreState>()((set, get) => ({
  ggridRef: null,
  setGGridRef: (ref) => set({ ggridRef: ref }),
  getGGridRef: () => get().ggridRef,
}));

export const useFilters = create<FiltersState>()(
  devtools((set) => ({
    linkedAndFilteredUsers: [],
    setLinkedAndFilteredUsers: (newLinkedAndFilteredUsers) =>
      set({ linkedAndFilteredUsers: newLinkedAndFilteredUsers }),
  })),
);

export const useIDs = create<IDsState>()(
  devtools((set) => ({
    namesIddbObj: {},
    setNamesIddbObj: (newNamesIddbObj) =>
      set({ namesIddbObj: newNamesIddbObj }),
    namesDatesDayIDsObj: {},
    setNamesDatesDayIDsObj: (newNamesDatesDayIDsObj) =>
      set({ namesDatesDayIDsObj: newNamesDatesDayIDsObj }),
    lockedDates: {},
    setLockedDates: (newlockedDates) => set({ lockedDates: newlockedDates }),
    usersSavedMessagesDates: {},
    setUsersSavedMessagesDates: (newUsersSavedMessagesDates) =>
      set({ usersSavedMessagesDates: newUsersSavedMessagesDates }),
  })),
);
