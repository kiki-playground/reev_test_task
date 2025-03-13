import { Page, Locator } from '@playwright/test';

export class SerialNumberPage {
    private page: Page;
    private serialNumberInputBox: Locator;
    private addButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.serialNumberInputBox = page.getByRole('textbox');
        this.addButton = page.getByRole('button', { name: 'Add' });
    }

    async goto() {
        await this.page.goto('/');
    }

    // Dynamic locator for checking if serial number exists
    getSerialNumberLocator(serialNumber: string): Locator {
        return this.page
            .getByRole('listitem')
            .filter({ hasText: serialNumber })
            .first();
    }

    // Dynamic locator for delete button based on serial number
    getDeleteButton(serialNumber: string): Locator {
        return this.getSerialNumberLocator(serialNumber)
            .getByRole('button', { name: 'X' });
    }

    async addSerialNumber(serialNumber: string) {
        await this.serialNumberInputBox.fill(serialNumber);
        await this.addButton.click();
    }

    async deleteSerialNumber(serialNumber: string) {
        await this.getDeleteButton(serialNumber).click();
    }
}