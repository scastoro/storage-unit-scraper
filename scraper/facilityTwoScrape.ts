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
  await page.goto(process.env.FACILITY_2_URL, { waitUntil: 'domcontentloaded' });

  const id = process.env.FACILITY_2_ID;

  console.log(id);
  const rows = await page.$$eval(
    '.table-theme-one table tr:not(:first-of-type)',
    (rows, id) =>
      rows.map((unit) => {
        return {
          dimensions: {
            length: unit
              .querySelector('td:nth-child(1)')
              ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
            width: unit
              .querySelector('td:nth-child(1)')
              ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
          },
          price: unit.querySelector('td:nth-child(3)')?.textContent?.replace(/,|\$/g, ''),
          climate: unit
            .querySelector('td:nth-child(2)')
            ?.firstChild?.textContent?.includes('Climate Controlled'),
          description: unit
            .querySelector('td:nth-child(2)')
            ?.firstChild?.textContent?.trim()
            .split(','),
          promotion:
            unit.querySelector('.specials')?.firstChild?.textContent?.trim() ||
            unit.querySelector('.no-offer')?.firstChild?.textContent?.trim(),
          type: unit
            .querySelector('td:nth-child(2)')
            ?.textContent?.trim()
            .split(',')[0]
            .toLowerCase(),
          size: unit.classList.contains('unit-division-1')
            ? 'small'
            : unit.classList.contains('unit-division-2')
            ? 'large'
            : undefined,
          facility: id,
        };
      }),
    id
  );
  console.log(rows);

  await browser.close();

  return rows;
};

export default facilityTwoScrape;
