import { Controller, Get } from '@nestjs/common';
//import Barangays from '../../../assets/barangays.json' assert { type: `json` };
import { readFile } from 'fs/promises';
import { join } from 'path';

@Controller('address')
export class TestAddressController {
  @Get('barangays')
  async getBarangays() {
    const json = JSON.parse(await readFile(join(__dirname, '../../../../../src/assets/barangays.json'), 'utf-8'));
    return json;
  }

  @Get('provinces')
  async getProvinces() {
    const json = JSON.parse(await readFile(join(__dirname, '../../../../../src/assets/provinces.json'), 'utf-8'));
    return json;
  }

  @Get('cities')
  async getCities() {
    const json = JSON.parse(await readFile(join(__dirname, '../../../../../src/assets/cities.json'), 'utf-8'));
    return json;
  }

  @Get('countries')
  async getCountries() {
    const json = JSON.parse(await readFile(join(__dirname, '../../../../../src/assets/countries.json'), 'utf-8'));
    return json;
  }
}
