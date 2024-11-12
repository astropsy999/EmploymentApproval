export interface RowData {
    'ФИО': string;
    [key: string]: any; // Дополнительные динамические поля
}

export interface LockedDatesData {
    [fio: string]: Date[]; 
}

export interface ApprovedDatesData {
    [fio: string]: { [date: string]: any }[]; 
}

export interface UserSavedMessagesDates {
    [fio: string]: { [message: string]: string }; // Или другой подходящий тип
}
