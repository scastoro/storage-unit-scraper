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
    let items = Array.from(
      document.querySelectorAll('.pure-g li[class*="unit-division-"]')
    );
    const results = items.map((item) => {
      return {
        dimensions: {
          length: item
            .querySelector('.container.size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
          width: item
            .querySelector('.container.size')
            ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
        },
        price: item.querySelector('.price')?.textContent?.replace(/,|\$/g, ''),
        climate: item
          .querySelector('.description')
          ?.firstChild?.textContent?.includes('Climate Controlled'),
        description: item
          .querySelector('.description')
          ?.firstChild?.textContent?.trim()
          .split(' - '),
        promotion:
          item.querySelector('.specials')?.firstChild?.textContent?.trim() ||
          item.querySelector('.no-offer')?.firstChild?.textContent?.trim(),
        type: item
          .querySelector('.description')
          ?.firstChild?.textContent?.trim()
          .split(' - ')[0]
          .toLowerCase(),
        size: item.classList.contains('unit-division-1')
          ? 'small'
          : item.classList.contains('unit-division-2')
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
