import * as puppeteer from 'puppeteer';
import '../config';
import { UnitInformation } from '../types';

const facilityTwoScrape = async (): Promise<UnitInformation[]> => {
  let browser: puppeteer.Browser;
  try {
    browser = await puppeteer.launch();
  } catch (e) {
    console.log(e);
  }
  const page = await browser.newPage();
  if (process.env.FACILITY_2_URL === undefined) {
    throw Error('Env variable undefined.');
  }
  await page.goto(process.env.FACILITY_2_URL);

  const id = process.env.FACILITY_2_ID;

  console.log(id);

  let data = await page.evaluate((id) => {
    let units = Array.from(
      document.querySelectorAll('.pure-g li[class*="unit-division-"]')
    );
    const results = units.map((unit) => {
      return {
        dimensions: {
          length: unit
            .querySelector('.container.size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
          width: unit
            .querySelector('.container.size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
        },
        price: unit.querySelector('.price')?.textContent?.replace(/,|\$/g, ''),
        climate: unit
          .querySelector('.description')
          ?.firstChild?.textContent?.includes('Climate Controlled'),
        description: unit
          .querySelector('.description')
          ?.firstChild?.textContent?.trim()
          .split(' - '),
        promotion:
          unit.querySelector('.specials')?.firstChild?.textContent?.trim() ||
          unit.querySelector('.no-offer')?.firstChild?.textContent?.trim(),
        type: unit
          .querySelector('.description')
          ?.firstChild?.textContent?.trim()
          .split(' - ')[0]
          .toLowerCase(),
        size: unit.classList.contains('unit-division-1')
          ? 'small'
          : unit.classList.contains('unit-division-2')
          ? 'large'
          : undefined,
        facility: id,
      };
    });

    return results;
  }, id);

  await browser.close();
  return data;
};

export default facilityTwoScrape;
