import {test,expect} from '@playwright/test';
test('navigation and quiz',async({page})=>{await page.goto('/');await expect(page.locator('h1')).toContainText('АВТОШКОЛА В ВОЛОГДЕ');await page.getByRole('button',{name:/Подобрать обучение/}).click();await expect(page.getByRole('dialog')).toBeVisible();for(const heading of ['Как вам удобно было бы проходить курс теории?','На какой коробке передач планируете обучение?','Пробовали управлять автомобилем?','Какой вариант оплаты вам подходит?','Так-так... А когда планируете обучение?']){await expect(page.getByRole('heading',{name:heading})).toBeVisible();await page.locator('.answer').first().click();await page.getByRole('button',{name:/Далее/}).click()}await expect(page.getByRole('heading',{name:/Оставьте контакты/})).toBeVisible();});

test('source coverage: public sections and responsive layout',async ({page})=>{
 for(const width of [390,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  for(const id of ['advantages','programs','process','offers','prices','instructors','reviews','contacts']) await expect(page.locator('#'+id)).toHaveCount(1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  expect(overflow, 'horizontal overflow at '+width).toBe(false);
 }
});

test('dialogs support Escape and return focus to trigger', async ({page})=>{
 await page.goto('/');
 const trigger=page.getByRole('button',{name:/Подобрать обучение/});
 await trigger.focus();await trigger.click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.locator('body')).toHaveCSS('overflow','hidden');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(trigger).toBeFocused();
 await page.locator('#tests').getByRole('button',{name:/Пройти тест/}).first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('each additional quiz completes without collecting personal data', async ({page})=>{
 await page.goto('/');
 for(const index of [0,1,2]){
  await page.locator('#tests').getByRole('button',{name:/Пройти тест/}).nth(index).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  for(let step=0;step<[4,6,6][index];step++){
   await dialog.locator('.answer').first().click();
   await dialog.getByRole('button',{name:step===[4,6,6][index]-1?'Результат':'Далее'}).click();
  }
  await expect(dialog.getByRole('heading',{name:'Вы прошли тест'})).toBeVisible();
  await expect(dialog.locator('input[type="tel"],input[type="email"]')).toHaveCount(0);
  await dialog.getByRole('button',{name:'Закрыть'}).last().click();
  await expect(dialog).toHaveCount(0);
 }
});

test('training and gift certificate are visible at multiple viewport sizes', async ({page})=>{
 for (const width of [390,768,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await expect(page.locator('#training')).toBeVisible();
  await expect(page.locator('#training').getByRole('heading',{name:'Теория ПДД'})).toBeVisible();
  await expect(page.locator('#gift')).toBeVisible();
  await expect(page.locator('#gift').getByRole('heading',{name:/Подарите/})).toBeVisible();
  await expect(page.locator('#gift').getByRole('button',{name:/Узнать о программе/})).toBeVisible();
 }
});
test('gift certificate call to action opens the main quiz', async ({page})=>{
 await page.goto('/');
 await page.locator('#gift').getByRole('button',{name:/Узнать о программе/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Как вам удобно было бы проходить курс теории?'})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
