module.exports = {
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'lf',
  semi: true,                           // dấu ; cuối dòng
  trailingComma: 'all',                 // điền dấu , ở item cuối cùng của object
  bracketSpacing: true,                 // khoảng trắng { a } thay vì {a}
  singleQuote: true,                    // dấu nháy '' thay vì ""
  printWidth: 80,
  arrowParens: 'avoid',                 // arrowfunction dạng: a => {} thay vì (a)=>{}
  quoteProps: 'as-needed',              // Bỏ dấu ngoặc đơn ở key của Object
  htmlWhitespaceSensitivity: 'ignore'   // <a></a> không cho xuống dòng ngu ngu dạng <a></a  \n >
};
