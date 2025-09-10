export enum LocaleEnum {
    Id = 'id',
    En = 'en',
    Ko = "ko"
}

export const LocaleEnumList = [
    LocaleEnum.Id,
    LocaleEnum.En,
    LocaleEnum.Ko
]

export function getLocaleLabel(locale: LocaleEnum) {
    switch (locale) {
        case LocaleEnum.Id:
            return 'Bahasa Indonesia';
        case LocaleEnum.En:
            return 'English';
        case LocaleEnum.Ko:
            return '한국어';
        default:
            return '';
    }
}