import {Directive, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from "@angular/forms";

@Directive({
   selector: '[positiveInteger]',
   providers: [{provide: NG_VALIDATORS, useExisting: PositiveIntegerValidatorDirective, multi: true}]
})
export class PositiveIntegerValidatorDirective implements Validator {
   validate(control: AbstractControl): {[key: string]: any} {
      return positiveIntegerValidator()(control)
   }
}

export function positiveIntegerValidator(): ValidatorFn {
   return (control: AbstractControl): {[key: string]: any} => {
      const invalid = !isPositiveInteger(control.value);
      return invalid ? {'negativeNumber': {value: control.value}} : null;
   };
}

export function isPositiveInteger(value: string) : boolean {
   let n = Math.floor(Number(value));
   return String(n) === value && n >= 0;
}