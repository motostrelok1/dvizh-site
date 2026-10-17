import { useState } from 'react';
import { useDialogKeyboard } from './useDialogKeyboard';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

type Question = { title:string; choices:string[] };
type Quiz = { id:string; title:string; lead:string; questions:Question[] };
export const extraQuizzes:Quiz[] = [
 {id:'gearbox',title:'Механика или автомат?',lead:'Узнайте, какой тип коробки может оказаться удобнее.',questions:[
 {title:'Что выберете вы?',choices:['Больше внимания уделить дороге','Полный контроль над автомобилем']},
 {title:'В каких условиях планируете ездить чаще всего?',choices:['В городе, по пробкам','Не определился','По трассе, на дальние расстояния']},
 {title:'Автомобиль какого возраста рассматриваете?',choices:['До 5 лет','5–10 лет','10+ лет']},
 {title:'Интересно ли вам разбираться в устройстве автомобиля?',choices:['Нет, у меня другие увлечения','Да, мне нравится разбираться в машине']}]},
 {id:'theory',title:'Сдам ли я теорию ПДД с первого раза?',lead:'Оцените привычки обучения.',questions:[
 {title:'Сколько времени вы можете уделять обучению?',choices:['1–2 часа в неделю','3–4 часа в неделю','5+ часов в неделю']},
 {title:'Я лучше запоминаю информацию:',choices:['На слух','Визуально','С помощью схем и таблиц']},
 {title:'В школе мне больше нравилось:',choices:['Учить стихотворения','Решать задачи','Рисовать']},
 {title:'Если нужно запомнить важное, я:',choices:['Держу это в голове','Записываю']},
 {title:'Мне проще даются задачи, требующие:',choices:['Гибкости и адаптивности','Концентрации и усидчивости','Самостоятельности']},
 {title:'Моя сильная сторона:',choices:['Быстрая обучаемость','Логика и аналитика','Коммукабельность и эмпатия']}]},
 {id:'driving',title:'Сдам ли я вождение с первого раза?',lead:'Исследуйте свой стиль подготовки.',questions:[
 {title:'Как часто сможете заниматься?',choices:['Раз в несколько недель','1–2 занятия в неделю','Более 2 занятий в неделю']},
 {title:'Я лучше запоминаю информацию:',choices:['С помощью схем и таблиц','На слух','Визуально']},
 {title:'В стрессовой ситуации я:',choices:['Стараюсь переждать','Беру себя в руки и ищу решения','Паникую']},
 {title:'Я могу описать себя как:',choices:['Спокойного человека','Активного человека','Тревожного человека']},
 {title:'Мне проще даются задачи, требующие:',choices:['Гибкости','Концентрации','Самостоятельности']},
 {title:'Моя сильная сторона:',choices:['Быстрая обучаемость','Логика и аналитика','Коммуникабельность']}]}
];
export default function ExtraQuizzes(){const [active,setActive]=useState<Quiz|null>(null);const [step,setStep]=useState(0);const [answers,setAnswers]=useState<Record<number,string>>({});const [finished,setFinished]=useState(false);function open(q:Quiz){setActive(q);setStep(0);setAnswers({});setFinished(false)}function close(){setActive(null)}const dialogRef=useDialogKeyboard<HTMLDivElement>(Boolean(active),close);return <section className="section quiz-gallery" id="tests"><div className="shell"><span className="eyebrow">ТЕСТЫ И ВОПРОСЫ</span><div className="section-heading"><h2>Найдите свой<br/><em>формат обучения.</em></h2><p>Три интерактивных теста по структуре публичных вопросов оригинала. Результаты демонстрационные, не являются прогнозом сдачи экзамена.</p></div><div className="quiz-card-grid">{extraQuizzes.map((q,i)=><article className="quiz-card" key={q.id}><span>ТЕСТ {String(i+1).padStart(2,'0')} / {q.questions.length} ВОПРОСОВ</span><h3>{q.title}</h3><p>{q.lead}</p><button className="btn btn-dark" onClick={()=>open(q)}>Пройти тест <ArrowRight size={18}/></button></article>)}</div></div>{active&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><div ref={dialogRef} className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="extra-quiz-title"><button className="close-button" aria-label="Закрыть" onClick={close}><X/></button><div className="quiz-topline"><span className="eyebrow">ИНТЕРАКТИВНЫЙ ТЕСТ</span><span>{Math.min(step+1,active.questions.length)} / {active.questions.length}</span></div><div className="progress"><span style={{width:`${step/active.questions.length*100}%`}}/></div>{finished?<div className="quiz-result"><div className="success-icon"><Check/></div><h2 id="extra-quiz-title">Вы прошли тест</h2><p>Ответы сохранены только в памяти этой страницы. Демо не формирует скидку, не собирает контакты и не предсказывает результат экзамена.</p><button className="btn btn-dark" onClick={close}>Закрыть</button></div>:<div className="quiz-stage"><span className="eyebrow">{active.title}</span><h2 id="extra-quiz-title">{active.questions[step].title}</h2><div className="answer-list">{active.questions[step].choices.map(choice=><button key={choice} className={`answer ${answers[step]===choice?'selected':''}`} aria-pressed={answers[step]===choice} onClick={()=>setAnswers(prev=>({...prev,[step]:choice}))}><span className="answer-radio">{answers[step]===choice&&<Check size={14}/>}</span>{choice}</button>)}</div><div className="quiz-actions"><button className="back" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ArrowLeft size={18}/>Назад</button><button className="btn btn-primary" disabled={!answers[step]} onClick={()=>step===active.questions.length-1?setFinished(true):setStep(s=>s+1)}>{step===active.questions.length-1?'Результат':'Далее'} <ArrowRight size={18}/></button></div></div>}</div></div>}</section>}
