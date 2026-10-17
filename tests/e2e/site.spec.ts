import {test,expect} from '@playwright/test';
test('navigation and quiz',async({page})=>{await page.goto('/');await expect(page.locator('h1')).toContainText('Свобода');await page.getByRole('button',{name:/Подобрать обучение/}).click();await expect(page.getByRole('dialog')).toBeVisible();for(const heading of ['Как вам удобно было бы проходить курс теории?','На какой коробке передач планируете обучение?','Пробовали управлять автомобилем?','Какой вариант оплаты вам подходит?','Так-так... А когда планируете обучение?']){await expect(page.getByRole('heading',{name:heading})).toBeVisible();await page.locator('.answer').first().click();await page.getByRole('button',{name:/Далее/}).click()}await expect(page.getByRole('heading',{name:/Оставьте контакты/})).toBeVisible();});

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
