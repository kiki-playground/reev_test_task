import {test, expect} from '@playwright/test';
import { SerialNumberPage } from '../page-objects/SerialNumberPage';
import {deleteTestSerialNumbers} from "../utils/cleanup-utils";

const SERIAL_NUMBERS_API_UI = ['SN123456e2eA', 'SN123-456e2eA', 'SN123:456e2eA'];
const SERIAL_NUMBERS_UI_API = ['SN123456e2eB', 'SN123-456e2eB', 'SN123:456e2eB'];
const ALL_SERIAL_NUMBERS = [...SERIAL_NUMBERS_API_UI, ...SERIAL_NUMBERS_UI_API];

const API_BASE_URL = process.env.API_BASE_URL

test.afterAll(async ({ request }) => {
    await deleteTestSerialNumbers(request, ALL_SERIAL_NUMBERS);
});

SERIAL_NUMBERS_API_UI.forEach((number) => {
    test(`Add serial number ${number} e2e, API first`, async ({page, request}) => {
        const snPage = new SerialNumberPage(page);
        const addResponse = await request.post(`${API_BASE_URL}/charge-point`, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            data: { serialNumber: number },
        });
        expect(addResponse.status()).toBe(201);
        const addResponseBody = await addResponse.json();
        expect(addResponseBody).toHaveProperty('serialNumber', number);

        await snPage.goto();
        await expect(snPage.getSerialNumberLocator(number)).toBeVisible();

        const serialId = addResponseBody.id;
        expect(serialId).toBeDefined();
        const deleteResponse = await request.delete(`${API_BASE_URL}/charge-point/${serialId}`, {
            headers: { 'Accept': 'application/json' },
        });
        expect(deleteResponse.status()).toBe(204);

        await snPage.goto();
        await expect(snPage.getSerialNumberLocator(number)).toBeHidden();
    });
});

SERIAL_NUMBERS_UI_API.forEach((number) => {
    test(`Add serial number ${number} e2e, UI first`, async ({page, request}) => {
        const snPage = new SerialNumberPage(page);
        await snPage.goto();
        await snPage.addSerialNumber(number);

        let getResponse = await request.get(`${API_BASE_URL}/charge-point`);
        expect(getResponse.status()).toBe(200);
        let getResponseBody = await getResponse.json();
        let serialItem = getResponseBody.find((item: {serialNumber: string}) => item.serialNumber === number);
        expect(serialItem).toBeDefined();

        await snPage.deleteSerialNumber(number);
        await expect(snPage.getSerialNumberLocator(number)).toBeHidden();

        getResponse = await request.get(`${API_BASE_URL}/charge-point`);
        expect(getResponse.status()).toBe(200);
        getResponseBody = await getResponse.json();
        serialItem = getResponseBody.find((item: {serialNumber: string}) => item.serialNumber === number);
        expect(serialItem).toBeUndefined();
    })
})