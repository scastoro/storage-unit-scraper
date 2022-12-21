import * as puppeteer from 'puppeteer';
import '../config';
import { UnitInformation } from '../types';

const facilityFourScrape = async (): Promise<UnitInformation[]> => {
  let browser: puppeteer.Browser;
  try {
    browser = await puppeteer.launch();
  } catch (e) {
    console.log(e);
  }
  const page = await browser.newPage();
  if (process.env.FACILITY_4_URL === undefined) {
    throw Error('Env variable undefined.');
  }
  await page.goto(process.env.FACILITY_4_URL, { waitUntil: 'domcontentloaded' });

  const id = process.env.FACILITY_4_ID;

  console.log(id);
  const rows = await page.$$eval(
    'table.GridViewStyle tr:not(:first-of-type)',
    (rows, id) =>
      rows.map((unit) => {
        return {
          dimensions: {
            length: unit
              .querySelector('td.UnitTypesUC_I_UnitSize')
              ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[0],
            width: unit
              .querySelector('td.UnitTypesUC_I_UnitSize')
              ?.textContent?.match(/[+-]?([0-9]*[.])?[0-9]+/g)[1],
          },
          price: unit.querySelector('td.UnitTypesUC_I_StdRate')?.textContent?.replace(/,|\$/g, ''),
          climate: unit
            .querySelector('td.UnitTypesUC_I_TypeName')
            ?.firstChild?.textContent?.includes('Climate Controlled'),
          description: undefined,
          promotion:
            unit.querySelector('.specials')?.firstChild?.textContent?.trim() ||
            unit.querySelector('.no-offer')?.firstChild?.textContent?.trim(),
          type: unit
            .querySelector('td.UnitTypesUC_I_TypeName')
            ?.textContent?.toLowerCase().includes('parking')
              ? 'parking'
              : 'self storage',
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

export default facilityFourScrape;
