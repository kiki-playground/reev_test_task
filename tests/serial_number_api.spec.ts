import {test, expect} from '@playwright/test';
import {deleteTestSerialNumbers} from "../utils/cleanup-utils";

const SERIAL_NUMBERS_TO_ADD = ['SN123456apiA', 'SN123-456apiA', 'SN123:456apiA'];
const SERIAL_NUMBERS_TO_DELETE = ['SN123456apiD', 'SN123-456apiD', 'SN123:456apiD'];
const ALL_SERIAL_NUMBERS = [...SERIAL_NUMBERS_TO_ADD, ...SERIAL_NUMBERS_TO_DELETE];

const API_BASE_URL = process.env.API_BASE_URL

test.afterAll(async ({ request }) => {
    await deleteTestSerialNumbers(request, ALL_SERIAL_NUMBERS);
});

SERIAL_NUMBERS_TO_ADD.forEach((number) => {
    test(`Add serial number ${number} via API`, async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/charge-point`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: { serialNumber: number },
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody).toHaveProperty('serialNumber', number);
    });
});


SERIAL_NUMBERS_TO_DELETE.forEach((number) => {
    test(`Add and delete serial number ${number} via API`, {
        tag: '@api_test',
    }, async ({ request }) => {
        const addResponse = await request.post(`${API_BASE_URL}/charge-point`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: { serialNumber: number },
        });
        expect(addResponse.status()).toBe(201);
        const addResponseBody = await addResponse.json();
        console.log(addResponseBody);
        expect(addResponseBody).toHaveProperty('serialNumber', number);

        const serialId = addResponseBody.id;
        expect(serialId).toBeDefined();

        const deleteResponse = await request.delete(`${API_BASE_URL}/charge-point/${serialId}`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        expect(deleteResponse.status()).toBe(204);
    });
});
