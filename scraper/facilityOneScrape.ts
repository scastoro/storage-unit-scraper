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
    let units = Array.from(document.querySelectorAll('.unit-item'));
    const results = units.map((unit) => {
      return {
        dimensions: {
          length: unit
            .querySelector('.row-unit-size-title')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
          width: unit
            .querySelector('.row-unit-size-title')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
        },
        start_price: unit.querySelector('del')?.textContent?.replace(/,|\$/g, ''),
        price: unit.querySelector('.price-bold')?.textContent?.replace(/,|\$/g, ''),
        climate: unit
          .querySelector('.card-text')
          ?.firstChild?.textContent?.trim()
          .split(', ')
          .includes('Climate Controlled'),
        description: unit.querySelector('.card-text')?.firstChild?.textContent?.trim().split(', '),
        promotion: unit.querySelector('.card-text-promo')?.textContent?.trim(),
        amount_left: unit.querySelector('.card-text-promo')?.textContent?.trim(),
        size: unit.getAttribute('data-size') === 'parking' 
          ? undefined 
          : unit.getAttribute('data-size').includes(',')
          ? unit.getAttribute('data-size').split(',')[0]
          : unit.getAttribute('data-size'),
        type: unit.getAttribute('data-size') === 'parking' ? 'parking' : 'self storage',
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
