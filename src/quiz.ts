export type Question = { id: string; title: string; options: string[]; helper: string };

/**
 * Wording transcribed from publicly visible source-page content.
 * Interactive branching and form submission remain unverified.
 */
export const questions: Question[] = [
 {id:'theory',title:'Как вам удобно было бы проходить курс теории?',options:['Онлайн','В классе','Совмещенно'],helper:'После прохождения опроса вы сможете узнать об условиях обучения.'},
 {id:'transmission',title:'На какой коробке передач планируете обучение?',options:['Категория B - Механика','Категория B - Автомат','Дополнительное вождение'],helper:'Выберите вариант, который подходит вам.'},
 {id:'experience',title:'Пробовали управлять автомобилем?',options:['Есть опыт вождения','Немного','Нет, совсем нет опыта'],helper:'Есть ли опыт вождения? Это поможет подобрать программу.'},
 {id:'payment',title:'Какой вариант оплаты вам подходит?',options:['Оплата полностью','Рассрочка от автошколы','Оплата мат.капиталом'],helper:'Выберите удобный способ оплаты.'},
 {id:'start',title:'Так-так... А когда планируете обучение?',options:['Как можно скорее','В течении недели или двух','В следующем месяце'],helper:'Укажите ориентировочное время начала занятий.'}
];
export function canContinue(answer?:string){return Boolean(answer?.trim());}
