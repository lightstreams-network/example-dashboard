import { css } from 'styled-components';

const globalStyles = css`
    :root {
        --green: #3affc9;
        --dark-purple: #302351;
        --purple: #855bf2;
        --silver: #ececec;
        --light-yellow: #fefae6;
        --pink: #ff2855;
    }

    .dbi { display: inline-block; }
    
    .p5 { padding: 5px; }
    /* Width Scale */

    .w1 {    width: 1rem; }
    .w2 {    width: 2rem; }
    .w3 {    width: 4rem; }
    .w4 {    width: 8rem; }
    .w5 {    width: 16rem; }

    .w-10 {  width:  10%; }
    .w-20 {  width:  20%; }
    .w-25 {  width:  25%; }
    .w-30 {  width:  30%; }
    .w-33 {  width:  33%; }
    .w-34 {  width:  34%; }
    .w-40 {  width:  40%; }
    .w-50 {  width:  50%; }
    .w-60 {  width:  60%; }
    .w-70 {  width:  70%; }
    .w-75 {  width:  75%; }
    .w-80 {  width:  80%; }
    .w-90 {  width:  90%; }
    .w-100 { width: 100%; }

    .w-third { width: calc(100% / 3); }
    .w-two-thirds { width: calc(100% / 1.5); }
    .w-auto { width: auto; }

    @media screen and (min-width: 30em) {
      .w1-ns {  width: 1rem; }
      .w2-ns {  width: 2rem; }
      .w3-ns {  width: 4rem; }
      .w4-ns {  width: 8rem; }
      .w5-ns {  width: 16rem; }
      .w-10-ns { width:  10%; }
      .w-20-ns { width:  20%; }
      .w-25-ns { width:  25%; }
      .w-30-ns { width:  30%; }
      .w-33-ns { width:  33%; }
      .w-34-ns { width:  34%; }
      .w-40-ns { width:  40%; }
      .w-50-ns { width:  50%; }
      .w-60-ns { width:  60%; }
      .w-70-ns { width:  70%; }
      .w-75-ns { width:  75%; }
      .w-80-ns { width:  80%; }
      .w-90-ns { width:  90%; }
      .w-100-ns { width: 100%; }
      .w-third-ns { width: calc(100% / 3); }
      .w-two-thirds-ns { width: calc(100% / 1.5); }
      .w-auto-ns { width: auto; }
    }

    @media screen and (min-width: 30em) and (max-width: 60em) {
      .w1-m {      width: 1rem; }
      .w2-m {      width: 2rem; }
      .w3-m {      width: 4rem; }
      .w4-m {      width: 8rem; }
      .w5-m {      width: 16rem; }
      .w-10-m { width:  10%; }
      .w-20-m { width:  20%; }
      .w-25-m { width:  25%; }
      .w-30-m { width:  30%; }
      .w-33-m { width:  33%; }
      .w-34-m { width:  34%; }
      .w-40-m { width:  40%; }
      .w-50-m { width:  50%; }
      .w-60-m { width:  60%; }
      .w-70-m { width:  70%; }
      .w-75-m { width:  75%; }
      .w-80-m { width:  80%; }
      .w-90-m { width:  90%; }
      .w-100-m { width: 100%; }
      .w-third-m { width: calc(100% / 3); }
      .w-two-thirds-m { width: calc(100% / 1.5); }
      .w-auto-m {    width: auto; }
    }

    @media screen and (min-width: 60em) {
      .w1-l {      width: 1rem; }
      .w2-l {      width: 2rem; }
      .w3-l {      width: 4rem; }
      .w4-l {      width: 8rem; }
      .w5-l {      width: 16rem; }
      .w-10-l {    width:  10%; }
      .w-20-l {    width:  20%; }
      .w-25-l {    width:  25%; }
      .w-30-l {    width:  30%; }
      .w-33-l {    width:  33%; }
      .w-34-l {    width:  34%; }
      .w-40-l {    width:  40%; }
      .w-50-l {    width:  50%; }
      .w-60-l {    width:  60%; }
      .w-70-l {    width:  70%; }
      .w-75-l {    width:  75%; }
      .w-80-l {    width:  80%; }
      .w-90-l {    width:  90%; }
      .w-100-l {   width: 100%; }
      .w-third-l { width: calc(100% / 3); }
      .w-two-thirds-l { width: calc(100% / 1.5); }
      .w-auto-l {    width: auto; }
    }

`;

export default globalStyles;
