/* 인터페이스 */
// 객체의 타입을 정의할 때 사용

/* 인터페이스 정의 */
interface User {
    name: string;
    age: number;
}

/* 객체 생성 (User 타입의 객체) */
const user1: User = {name: '홍길동', age: 20};

/* 함수의 파라미터와 리턴 타입으로 인터페이스 사용 */
function getUserInfo(user: User): User {
    return user1;
}
const user2: User = getUserInfo({name: '강감찬', age: 30});

/* 인터페이스 옵셔널 속성 */
interface User2 {
    name: string;
    age?: number; // age는 없어도 된다는 뜻.
}
const user3: User2 = {name: '이순신', age: 40};
const user4: User2 = {name: '이순신'}; // age가 없어도 에러가 안 뜸.

/* 인터페이스 상속 */
interface Animal {
    name: string;
    legCnt: number;
}
interface Bird extends Animal {
    hasWing: boolean;
}
const bird1: Bird = {name: '독수리', legCnt: 2, hasWing: true};
// const bird2: Bird = {name: '독수리', legCnt: 2}; // hasWing도 있어야 에러가 안 뜸.

/* 객체 프라퍼티 명으로 숫자를 사용 */
interface Student {
    [key: number]: string; // [key: number] - key에 number 타입으로 쓰라는 뜻
}
const student: Student = {1: '홍길동', 2: '강감찬'};

/* 객체 프라퍼티 명으로 문자를 사용 */
interface Student2 {
    [key: string]: string; // [key: string] - key에 string 타입으로 쓰라는 뜻
}
const student2: Student2 = {'1': '홍길동', '2': '강감찬'};

/* 배열 인덱스로 숫자 사용 */
interface Student3 {
    [index: number]: string;
}
const student3: Student3 = ['홍길동', '강감찬']; // '홍길동' - 0, '강감찬' - 1

/* 배열 인덱스로 문자 사용 */
// 타입 스크립트에서는 배열은 문자로 사용 불가.
// interface Student4 {
//     [index: string]: string;
// }
// const student4: Student4 = ['홍길동', '강감찬'];

/* 유니온 타입 (union type) */
// 여러 타입 중 하나
let un: string | number; // string이 와도 되고 number가 와도 된다.
un = '홍길동';
un = 100;
// un = true; // boolean은 넣지 않았기 때문에 에러.

/* 함수 파라미터로 유니온 타입 선언 */
interface Pen {
    name: string;
    color: string;
}
interface Note {
    name: string;
    pages: number;
}
/* type guard */
// 객체가 가진 프라퍼티로 객체를 식별
function getInfo(obj: Pen | Note): void {
    if ('color' in obj) { // type guard
        console.log(obj.name, obj.color);
    } else if ('pages' in obj) {
        console.log(obj.name, obj.pages);
    }
}
const pen = {name: '볼펜', color: '파랑'};
const note = {name: '연습장', pages: 100};
getInfo(pen);
getInfo(note);

/* 인터섹션(intersection) 타입 */
// 타입 2개 이상을 하나로 합쳐서 사용
interface I1 {
    name: string;
}
interface I2 {
    age: number;
}
interface I3 {
    hobby: string[];
}
const is1: I1 & I2 & I3 = { // 인터섹션(intersection)
    name: '홍길동',
    age: 30,
    hobby: ['축구', '농구']
};

/* 타입 별칭 (alias) */
// - 타입에 대한 별도의 이름
// - 타입 코드를 줄일 목적으로 사용
// - 인터페이스는 객체의 타입을 정의하고 상속이 가능하나 타입 별칭은 모든 타입들을 정의하고 상속이 불가능
type myStr = string; // myStr이 string으로 됨.
const myStr: myStr = '홍길동';

type myNum = number;
const myNum: myNum = 30;

type myType = string | number | boolean;
const mt1: myType = '홍길동';
const mt2: myType = 30;
const mt3: myType = false;

/* 인터페이스의 선언 병합 (declaration merging) */
// 인터페이스를 동일한 이름으로 2개 이상 선언하면 프라퍼티들이 합쳐짐
// cf) 타입 별칭을 동일한 이름으로 선언 불가
interface Int1 {
    name: string;
}
interface Int1 {
    age: number;
}
const int1: Int1 = {name: '홍길동', age: 30};

/* enum 타입 */
// 여러 개의 상수를 정의하기 위한 타입
// 선언된 순서대로 0, 1, 2 ... 의 값을 가짐
enum Planet {
    MERCURY,
    VUNUS,
    EARTH,
    MARS
}
const earth: number = Planet.EARTH; // 2
const mars: number = Planet.MARS; // 3

/* enum 초기값 할당 */
enum Planet2 {
    MERCURY = 0,
    VUNUS = 1,
    EARTH = 2,
    MARS = 3
}
enum Planet3 {
    MERCURY = '수성',
    VUNUS = '금성',
    EARTH = '헬',
    MARS = '화성'
}

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
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    getName(): string {
        return this.name;
    }
    getAge(): number {
        return this.age;
    }
}
const person1 = new Person('홍길동', 30);

/* 접근제어자 */
// public : 클래스 내외부에서 접근 가능, 접근제어자 생략 시 public
// protected : 클래스 내부 또는 상속받은 클래스 내부에서 접근 가능
// private : 클래스 내부에서 접근 가능 (#, ES2020)
class Person2 {
    #name: string;
    age: number;
    constructor(name: string, age: number) {
        this.#name = name;
        this.age = age;
    }
    getName(): string {
        return this.#name;
    }
    getAge(): number {
        return this.age;
    }
}
const person2 = new Person2('홍길동', 30);

/* 제네릭 (generic) */
// - 타입을 실행 시점에 정의하기 위한 문법
// - 제네릭을 사용하면 반복적인 타입 선언을 줄일 수 있다.
// - any를 사용하면 어떤 타입도 받을 수 있지만
//   에러 방지, 코드 자동 완성과 같은 타입 스크립트의 장점을 살릴 수 없다.

function getText<T>(text: T): T {
    return text;
}
getText<string>('hi');
getText<number>(100);

/* 인터페이스에 제네릭 사용 */
interface Animal2<T> {
    name: string;
    body: T
}
const animal1: Animal2<{color: string, legCount: number}> = {
    name: '호랑이',
    body: {color: '얼룩덜룩', legCount: 4}
};

/* 제네릭에 제약 부여 */
// <T extends string> : string을 상속받는 임의의 타입
function printName<T extends string>(name: T): T {
    return name;
}
printName('홍길동'); // string을 상속받은 타입이라 string만 올 수 있다. 

/* extends */
// 뒤에 나오는 타입과 호환타입을 허용
// {length: number} : 인터페이스
function lengthOnly<T extends {length: number}>(value: T): number {
    return value.length;
}
lengthOnly('123'); // '123'은 문자열이지만 length 프라퍼티를 가지고 있어서 가능하다.
lengthOnly([1, 2, 3]); // 배열은 length 프라퍼티를 가지고 있다.

/* 제네릭과 유니온 결합 */
function lengthOnly2<T extends string | number>(value: T): number {
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
function printKeys<T extends keyof {name: string; skill: string;}>(value: T): void {
    console.log(value);
}
printKeys('name');
printKeys('skill');
// printKeys('hobby'); // 프라퍼티 이름들만 값으로 받기 때문에 hobby는 에러가 뜸.