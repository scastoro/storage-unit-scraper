export interface UnitInformation {
  dimensions: {
    length: string;
    width: string;
  };
  start_price?: string;
  price: string;
  climate: boolean;
  description: string[];
  promotion?: string;
  amount_left?: string;
  size?: string;
  type?: string;
  facility: any;
}
