/* 타입 추론 (type inference) */
// - 타입 스크립트에서 개발자가 타입을 명시하지 않아도 트랜스 컴파일러가
//    타입을 추론할 수 있는 경우에는 타입을 명시하지 않아도 됨.
// - 타입 추론을 사용하면 타입 선언 코드가 줄어서 가독성이 높아질 수 있음.
// - 변수 초기화, 함수의 매개변수 기본값 설정, 함수의 값 반환 시에 타입 추론이 일어난다.
/* 변수 초기화 시 타입 추론 */
let str1; // any 타입으로 추론됨
let str2 = 'hello'; // string 타입으로 추론됨
let num1 = 100; // number 타입으로 추론됨
/* 함수 반환값 타입 추론 */
// 반환되는 a + b의 결과값이 number인 것이 명확하므로 반환 타입 지정을 추론할 수 있으므로 생략 가능
function add(a, b) {
    return a + b;
}
// 반환값을 저장하는 result1 변수의 타입도 당연히 number이므로 타입 지정 생략 가능
let result1 = add(1, 2);
/* 함수 매개변수 기본값으로 타입 추론 */
function add2(a = 1, b = 2) {
    return a + b;
}
let result2 = add(3, 4);
const person = {
    name: '홍길동',
    hobby: ['축구', '농구']
};
/* 타입 단언 (type assertion) */
// - 타입 스크립트의 타입 추론을 사용하는 대신 개발자가 직접 타입을 명시
// - as 키워드를 사용하여 개발자가 직접 타입을 선언
// - 이미 개발된 자바 스크립트 코드를 어쩔 수 없이 수정해야 하는 경우에만 사용하자!
// hong의 타입은 이제부터 string이다!
const hong = '홍길동';
// Human 타입은 name과 age 프라퍼티를 정의해야 함!
// let human: Human = {};
// human은 앞으로 name과 age 프라퍼티를 가질 Human 타입의 객체
let human = {};
function getId(id) {
    return id;
}
// getId 함수는 string 타입의 값을 반환할 것이다!
const myId = getId('hong');
/* 타입 단언 중첩 */
// 10이라는 값을 any 타입으로 하고 다시 number 타입으로 단언
const number = 10;
function shuffleBooks(books) {
    const result = books === null || books === void 0 ? void 0 : books.shuffle();
    // const result = books!.shuffle(); // 트랜스 파일 시 노에러, 실행 시 에러
    return result;
}
shuffleBooks(null);
/* 타입 가드 (type guard) */
// 여러 개의 타입으로 지정된 값을 특정 위치에서 원하는 타입으로 구분
// typeof, instanceof, in 연산자들 통해서 타입 범위를 좁히는 것
const v1 = 'hello';
if (typeof v1 === 'string') { // 타입을 string으로 한정 (타입카드)
    console.log(v1.toUpperCase());
}
// 타입 단언을 이용해서 타입을 number로 한정 (타입 가드)
function func1(param1) {
    console.log(param1.toFixed(2));
}
func1(3.1415);
function Bird(name) {
    this.name = name;
}
function Mammal(name, breastfeed) {
    this.name = name;
    this.breastfeed = breastfeed;
}
const bird = new Bird('독수리');
if (bird instanceof Bird) {
    console.log(bird.name);
}
const book = { name: '타입 스크립트', author: '마인크로소프트' };
if ('author' in book) { // Book 타입
    console.log(book);
}
if ('tutor' in book) { // Lecture 타입
    console.log(book);
}
function isHongOrPark(someone) {
    return someone.age != undefined;
}
const designer = {
    name: '홍길순',
    age: 20,
    jobName: 'designer'
};
const programmer = {
    name: '홍길동',
    age: 30,
    jobName: 'programmer'
};
// 두 타입의 프라퍼티 명이 모두 같으므로 특정 프라퍼티의 값으로 두 타입을 구분(타입 가드)한다.
if (designer.jobName === 'designer') {
    console.log(designer.jobName);
}
if (programmer.jobName === 'programmer') {
    console.log(programmer.jobName);
}
