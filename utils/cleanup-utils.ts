import { APIRequestContext, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL

export async function deleteTestSerialNumbers(request: APIRequestContext, allSerialNumbers: string[]) {
    const response = await request.get(`${API_BASE_URL}/charge-point`);
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();

    const serialsToDelete = responseBody.filter((item: { serialNumber: string }) =>
        allSerialNumbers.includes(item.serialNumber));

    for (const serial of serialsToDelete) {
        const deleteResponse = await request.delete(`${API_BASE_URL}/charge-point/${serial.id}`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        expect(deleteResponse.status()).toBe(204);
    }
}
