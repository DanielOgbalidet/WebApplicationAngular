import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'convertCurrency'
})

export class ConvertCurrency implements PipeTransform {
  transform(value: number, character: string): string {
    return character + ' ' + value.toString();
  }
}
