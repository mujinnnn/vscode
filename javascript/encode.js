// encode / decode
// encode : 코드를 변환
// decode : 변환된 코드를 원복

const name = '홍길동';
const age = 20;
const gender = '남';

let uri = `https://smartstore.naver.com/wooshin001/products/10307314965?NaPm=ct%3Dlxtufv88%7Cci%3Ddc9e7a5ea446d4a688b8c14d8ff6d0b789ea553f%7Ctr%3Dnshfu%7Csn%3D678164%7Chk%3D8104aa7b8acbd8d25c0ee6749e836d961d25f5ca`;

console.log(uri, '\n');
const enURI = encodeURI(uri); // ? = & 인코딩 안 함
console.log(enURI, '\n');
const deURI = decodeURI(enURI);
console.log(deURI, '\n');

console.log(uri, '\n');
const enURIComp = encodeURIComponent(uri); // ? = & 인코딩 함
console.log(enURIComp, '\n');
const deURIComp = decodeURIComponent(enURI);
console.log(deURIComp, '\n');