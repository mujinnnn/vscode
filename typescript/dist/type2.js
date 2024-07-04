/* 인터페이스 */
// 객체의 타입을 정의할 때 사용
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Person2_name;
/* 객체 생성 (User 타입의 객체) */
const user1 = { name: '홍길동', age: 20 };
/* 함수의 파라미터와 리턴 타입으로 인터페이스 사용 */
function getUserInfo(user) {
    return user1;
}
const user2 = getUserInfo({ name: '강감찬', age: 30 });
const user3 = { name: '이순신', age: 40 };
const user4 = { name: '이순신' }; // age가 없어도 에러가 안 뜸.
const bird1 = { name: '독수리', legCnt: 2, hasWing: true };
const student = { 1: '홍길동', 2: '강감찬' };
const student2 = { '1': '홍길동', '2': '강감찬' };
const student3 = ['홍길동', '강감찬']; // '홍길동' - 0, '강감찬' - 1
/* 배열 인덱스로 문자 사용 */
// 타입 스크립트에서는 배열은 문자로 사용 불가.
// interface Student4 {
//     [index: string]: string;
// }
// const student4: Student4 = ['홍길동', '강감찬'];
/* 유니온 타입 (union type) */
// 여러 타입 중 하나
let un; // string이 와도 되고 number가 와도 된다.
un = '홍길동';
un = 100;
/* type guard */
// 객체가 가진 프라퍼티로 객체를 식별
function getInfo(obj) {
    if ('color' in obj) { // type guard
        console.log(obj.name, obj.color);
    }
    else if ('pages' in obj) {
        console.log(obj.name, obj.pages);
    }
}
const pen = { name: '볼펜', color: '파랑' };
const note = { name: '연습장', pages: 100 };
getInfo(pen);
getInfo(note);
const is1 = {
    name: '홍길동',
    age: 30,
    hobby: ['축구', '농구']
};
const myStr = '홍길동';
const myNum = 30;
const mt1 = '홍길동';
const mt2 = 30;
const mt3 = false;
const int1 = { name: '홍길동', age: 30 };
/* enum 타입 */
// 여러 개의 상수를 정의하기 위한 타입
// 선언된 순서대로 0, 1, 2 ... 의 값을 가짐
var Planet;
(function (Planet) {
    Planet[Planet["MERCURY"] = 0] = "MERCURY";
    Planet[Planet["VUNUS"] = 1] = "VUNUS";
    Planet[Planet["EARTH"] = 2] = "EARTH";
    Planet[Planet["MARS"] = 3] = "MARS";
})(Planet || (Planet = {}));
const earth = Planet.EARTH; // 2
const mars = Planet.MARS; // 3
/* enum 초기값 할당 */
var Planet2;
(function (Planet2) {
    Planet2[Planet2["MERCURY"] = 0] = "MERCURY";
    Planet2[Planet2["VUNUS"] = 1] = "VUNUS";
    Planet2[Planet2["EARTH"] = 2] = "EARTH";
    Planet2[Planet2["MARS"] = 3] = "MARS";
})(Planet2 || (Planet2 = {}));
var Planet3;
(function (Planet3) {
    Planet3["MERCURY"] = "\uC218\uC131";
    Planet3["VUNUS"] = "\uAE08\uC131";
    Planet3["EARTH"] = "\uD5EC";
    Planet3["MARS"] = "\uD654\uC131";
})(Planet3 || (Planet3 = {}));
/* const enum */
// js로 변환되는 코드의 양을 감소시킨 enum
// enum Planet4 {
//     MERCURY = '수성',
//     VUNUS = '금성',
//     EARTH = '헬',
//     MARS = '화성'
// }
/* 클래스 */
// - 타입 스크립트에서는 클래스의 프라퍼티들을 미리 정의해 줘야 함.
// - 생성자의 파라미터 타입과 메서드의 반환타입을 정의해 줘야 함.
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
    getAge() {
        return this.age;
    }
}
const person1 = new Person('홍길동', 30);
/* 접근제어자 */
// public : 클래스 내외부에서 접근 가능, 접근제어자 생략 시 public
// protected : 클래스 내부 또는 상속받은 클래스 내부에서 접근 가능
// private : 클래스 내부에서 접근 가능 (#, ES2020)
class Person2 {
    constructor(name, age) {
        _Person2_name.set(this, void 0);
        __classPrivateFieldSet(this, _Person2_name, name, "f");
        this.age = age;
    }
    getName() {
        return __classPrivateFieldGet(this, _Person2_name, "f");
    }
    getAge() {
        return this.age;
    }
}
_Person2_name = new WeakMap();
const person2 = new Person2('홍길동', 30);
/* 제네릭 (generic) */
// - 타입을 실행 시점에 정의하기 위한 문법
// - 제네릭을 사용하면 반복적인 타입 선언을 줄일 수 있다.
// - any를 사용하면 어떤 타입도 받을 수 있지만
//   에러 방지, 코드 자동 완성과 같은 타입 스크립트의 장점을 살릴 수 없다.
function getText(text) {
    return text;
}
getText('hi');
getText(100);
const animal1 = {
    name: '호랑이',
    body: { color: '얼룩덜룩', legCount: 4 }
};
/* 제네릭에 제약 부여 */
// <T extends string> : string을 상속받는 임의의 타입
function printName(name) {
    return name;
}
printName('홍길동'); // string을 상속받은 타입이라 string만 올 수 있다. 
/* extends */
// 뒤에 나오는 타입과 호환타입을 허용
// {length: number} : 인터페이스
function lengthOnly(value) {
    return value.length;
}
lengthOnly('123'); // '123'은 문자열이지만 length 프라퍼티를 가지고 있어서 가능하다.
lengthOnly([1, 2, 3]); // 배열은 length 프라퍼티를 가지고 있다.
/* 제네릭과 유니온 결합 */
function lengthOnly2(value) {
    if (typeof value === 'string') {
        return value.length;
    }
    return value;
}
lengthOnly2('123'); // 3
lengthOnly2(123); // 123
/* keyof */
// 객체의 프라퍼티들의 키들을 추출해 문자열 유니온 타입으로 변환
//  = 프라퍼티 명과 같은 문자열들만 받겠다!
function printKeys(value) {
    console.log(value);
}
printKeys('name');
printKeys('skill');
// printKeys('hobby'); // 프라퍼티 이름들만 값으로 받기 때문에 hobby는 에러가 뜸.
