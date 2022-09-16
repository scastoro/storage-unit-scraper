import * as puppeteer from 'puppeteer';
import '../config';
import { UnitInformation } from '../types';

const facilityThreeScrape = async (): Promise<UnitInformation[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (process.env.FACILITY_3_URL === undefined) {
    throw Error('Env variable is undefined');
  }
  await page.goto(process.env.FACILITY_3_URL);

  const id = process.env.FACILITY_3_ID;

  let data = await page.evaluate((id) => {
    let units = Array.from(document.querySelectorAll('div[itemprop="item"]'));

    const results = units.map((unit) => {
      return {
        dimensions: {
          length: unit
            .querySelector('.lvu-unit-size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
          width: unit
            .querySelector('.lvu-unit-size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
        },
        start_price: unit
          .querySelector('del')
          ?.textContent?.replace(/,|\$/g, ''),
        price: unit
          .querySelector('p.unit-rate.price')
          ?.textContent?.replace(/,|\$/g, '')
          .trim(),
        climate: Array.from(
          unit.querySelectorAll('ul.lvu-v3-amenities-descriptions li')
        )
          ?.map((listItem) => listItem.textContent?.trim())
          .includes('Climate Controlled'),
        description: Array.from(
          unit.querySelectorAll('ul.lvu-v3-amenities-descriptions li')
        )?.map((listItem) => listItem.textContent?.trim()),
        amount_left: unit.classList.contains('parking')
          ? document.querySelector('span.label')?.textContent?.trim()
          : unit.querySelector('.lvu-v3-remainder span')?.textContent?.trim(),
        promotion: null,
        size: unit.classList.contains('sm')
          ? 'small'
          : unit.classList.contains('md')
          ? 'medium'
          : unit.classList.contains('lg')
          ? 'large'
          : unit.classList.contains('xl')
          ? 'extra large'
          : undefined,
        type: unit.classList.contains('parking')
          ? 'parking'
          : unit.querySelector('h5.lvu-unit-name').textContent.includes('RV')
          ? 'RV'
          : 'self storage',
        facility: id,
      };
    });

    return results;
  }, id);

  console.log(data);
  await browser.close();
  return data;
};

export default facilityThreeScrape;
