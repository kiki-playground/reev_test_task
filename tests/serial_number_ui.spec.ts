import {test, expect} from '@playwright/test';
import { SerialNumberPage } from '../page-objects/SerialNumberPage';
import {deleteTestSerialNumbers} from "../utils/cleanup-utils";

const SERIAL_NUMBERS_TO_ADD = ['SN123456A', 'SN123-456A', 'SN123:456A'];
const SERIAL_NUMBERS_TO_DELETE = ['SN123456D', 'SN123-456D', 'SN123:456D'];

const ALL_SERIAL_NUMBERS = [...SERIAL_NUMBERS_TO_ADD, ...SERIAL_NUMBERS_TO_DELETE];

test.afterAll(async ({ request }) => {
  await deleteTestSerialNumbers(request, ALL_SERIAL_NUMBERS);
});

SERIAL_NUMBERS_TO_ADD.forEach((number) => {
  test(`Add serial number ${number}`, {
    tag: '@serial_number',
  }, async ({ page }) => {
    const snPage = new SerialNumberPage(page);
    await snPage.goto();
    await snPage.addSerialNumber(number);
    await expect(snPage.getSerialNumberLocator(number)).toBeVisible();

    await snPage.goto();
    await expect(snPage.getSerialNumberLocator(number)).toBeVisible();
  });
});

SERIAL_NUMBERS_TO_DELETE.forEach((number) => {
  test(`Add and delete serial number ${number}`, {
    tag: '@serial_number',
  }, async ({ page }) => {
    const snPage = new SerialNumberPage(page);
    await snPage.goto();
    await snPage.addSerialNumber(number);
    await expect(snPage.getSerialNumberLocator(number)).toBeVisible();
    await snPage.deleteSerialNumber(number);
    await expect(snPage.getSerialNumberLocator(number)).toBeHidden();

    await snPage.goto();
    await expect(snPage.getSerialNumberLocator(number)).toBeHidden();
  });
});
