export interface RowData {
    'ФИО': string;
    [key: string]: any; // Дополнительные динамические поля
}

export interface LockedDatesData {
    [fio: string]: any[]; // Уточните тип элементов массива, если возможно
}

export interface ApprovedDatesData {
    [fio: string]: { [date: string]: any }[]; // Уточните тип, если возможно
}

export interface UserSavedMessagesDates {
    [fio: string]: { [message: string]: string }; // Или другой подходящий тип
}
