/* 타입스크립트의 type */
// 타입스크립트 변수에 타입을 지정하러면 : 을 사용
// string
let hello = 'hello';
console.log(hello);
// hello = 100; // error (타입을 지정해놓으면 다른 타입은 올 수 없다.)
// number
let num = 10;
// boolean
let bool = true;
// object
let obj = {
    name: '홍길동',
    age: 20
};
// array
let arr1 = ['홍길동', '강감찬', '이순신']; // 문자열 배열 타입
let arr2 = ['홍길동', '강감찬', '이순신']; // 제네릭
// tuple
// 고정 길이이며 요소들의 타입이 미리 정의된 배열
let tup = ['홍길동', 20];
// any
// 어떤 타입 값도 모두 허용
// any 타입을 많이 쓰면 타입스크립트를 사용할 이유가 없다.
// 어떤 타입인 지 명확히 알 수 없을 경우에만 제한적으로 사용한다.
let at = 100;
at = '백';
at = [1, 2, 3];
// null
// null은 타입 이름이기도 하고 값이기도 함.
let nul = null;
// undefined
// undefined는 타입 이름이기도 하고 값이기도 함.
let und = undefined;
// function
// 파라미터, 반환타입을 지정
function getStr(str) {
    return 'hi ' + str;
}
getStr('홍길동');
// 함수 호출 시에 인자 개수와 파라미터 개수를 맞춰야 함.
// 반환 값이 없으면 void를 명시해 줘야 함.
function getInfo1(name, age, hobby) {
    console.log(name, age, hobby);
}
getInfo1('홍길동', 20, '축구');
// getInfo1('홍길동', 20); // error - 파라미터가 세 개지만 인자를 두 개만 쓰게 되면 에러, 개수를 맞춰줘야 함.
// optional parameter : 파라미터에 해당하는 인자가 없을 때는 ?를 사용
function getInfo2(name, age, hobby) {
    console.log(name, age, hobby);
}
getInfo2('홍길동', 20, '축구');
getInfo2('홍길동', 20); // hobby?이기 때문에 인자를 두 개만 써도 에러가 안 남.
