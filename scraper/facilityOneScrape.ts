import * as puppeteer from 'puppeteer';
import '../config';
import { UnitInformation } from '../types';

const facilityOneScrape = async (): Promise<UnitInformation[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (process.env.FACILITY_1_URL === undefined) {
    throw Error('Env variable is undefined');
  }
  await page.goto(process.env.FACILITY_1_URL);

  const id = process.env.FACILITY_1_ID;

  let data = await page.evaluate((id) => {
    let items = Array.from(document.querySelectorAll('.unit-item'));
    const results = items.map((item) => {
      return {
        dimensions: {
          length: item
            .querySelector('.card-unit-size-title')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
          width: item
            .querySelector('.card-unit-size-title')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
        },
        start_price: item.querySelector('del')?.textContent?.replace(/,|\$/g, ''),
        price: item.querySelector('.price-bold')?.textContent?.replace(/,|\$/g, ''),
        climate: item
          .querySelector('.card-text')
          ?.firstChild?.textContent?.trim()
          .split(', ')
          .includes('Climate Controlled'),
        description: item.querySelector('.card-text')?.firstChild?.textContent?.trim().split(', '),
        promotion: item.querySelector('.card-text-promo')?.textContent?.trim(),
        amount_left: item.querySelector('.card-text-promo')?.textContent?.trim(),
        size: item.getAttribute('data-size') === 'parking' 
          ? undefined 
          : item.getAttribute('data-size').includes(',')
          ? item.getAttribute('data-size').split(',')[0]
          : item.getAttribute('data-size'),
        type: item.getAttribute('data-size') === 'parking' ? 'parking' : 'self storage',
        facility: id,
      };
    });

    return results;
  }, id);

  console.log(data);
  await browser.close();
  return data;
};

export default facilityOneScrape;
