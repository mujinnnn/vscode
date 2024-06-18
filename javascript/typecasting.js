// 타입 변환 (Type Casting)

// 1. 묵시적 형변환
//  1) 엔진이 연산자를 어떤 연산으로 처리할 지 생각
//  2) 피연산자가 형변환이 가능한 지 생각
console.log(null + '');         // 'null' (null의 문자열 'null')
console.log(1 - '1');           // 0 (앞이 -라 뒤의 문자열을 숫자로 인식해서 1 - 1 = 0)
console.log(1 / 'one');         // NaN ('one'을 숫자로 변환할 수 없는데 숫자로 결과를 내야해서 NaN)
console.log(+'0');              // 0 (앞이 +라 엔진은 뒤를 숫자로 인식)
console.log(+'string');         // NaN ('string'을 숫자로 변환할 수 없는데 숫자로 결과를 내야해서 NaN)
console.log((Symbol()) + '');   // TypeError
console.log([] + '');           // '' (배열 안에 원소들이 아무것도 없기 때문에)
console.log(+undefined);        // NaN (앞이 +라 엔진은 뒤를 숫자로 인식하지만 undefined이기 때문에 NaN)
console.log(+true);             // 1 (1이 true라서)
console.log(+false);            // 0 (0이 false라서)
console.log(!false);            // true (false의 부정은 true)
console.log(!null);             // true (null은 0이고 0은 false라서 false의 부정은 true)
console.log(!'');               // true (''은 false이기 때문에 false의 부정은 true)

// 2. 명시적 형변환
//  1) new가 없는 생성자 함수 사용
//  2) 형변환에서도 사용
// false로 판별될 수 있는 것들 : false, NaN, 0, -0, undefined, null, ''
// false : 0, true : 1
console.log(String(1));         // '1' (숫자를 문자열로 변환)
console.log((1).toString());    // '1' (숫자를 문자열로 변환)
console.log(number(false));     // 0 (false가 0이라서)
console.log(parseInt('1'));     // 1 (문자열로 숫자로 변환)
console.log(Boolean('x'));      // true (문자가 하나라도 있으면 true)
console.log(Boolean(''));       // false (문자가 하나라도 없으면 false)
console.log(Boolean(0));        // false (0은 false이기 때문에)
console.log(Boolean(1));        // true (1은 true기 때문에)
console.log(Boolean({}));       // true (객체 안에 있는 걸로 판단하기 때문에 true)
console.log(Boolean([]));       // true (배열 안에 있는 걸로 판단하기 때문에 true)

// 3. 단축 평가 (short-circuit evaluation)
// 논리합(||), 논리곱(&&) 연산 시 연산 중간에 결과를 알 수 있으면 평가 중간에 평가를 종료
console.log('Cat' || 'Dog');    // Cat ('Cat'은 문자열이 하나라도 있어서 true이기 때문에 우측을 평가할 필요가 없음)
console.log('Cat' && 'Dog');    // Dog ('Cat'은 true지만 &&이기 때문에 우측을 봐야함)
console.log('' || 'Dog');       // Dog (''은 false고 ||이기 때문에 우측을 봐야함)
console.log('' && 'Dog');       // 결과 X (''은 false고 &&이기 때문에 우측을 봐야함)
console.log(true || 1);         // true (좌측이 true고 ||이면 우측을 볼 필요 없음)
console.log(0 || true);         // true (0은 false고 우측이 true이기 때문에)
console.log(true && 1);         // 1 (좌측이 true지만 &&이기 때문에 우측을 보고 판단)
console.log(1 && true);         // true (좌측이 1이지만 &&이기 때문에 우측을 보고 판단)

let done = true;
let message = '';
message = done && 'completed';
console.log(message);           // completed (done이 true지만 &&이기 때문에 우측을 보고 판단)

// elem이 null일 경우 참조에러에 대비하는 코드
let elem = null;
let result = elem && elem.value;
console.log(result);            // null (elem이 null이고 &&이기 때문에 우측을 보고 판단)

// 4. 옵셔널 체이닝 연산자 (optional chaining operator) : ?. (ECMA2020)
// 좌측 피연산자가 null이나 undefined인 경우 undefined로 반환, 그렇지 않으면 우측 피연산자 값을 반환
// 목적 - null 참조 오류를 회피
let elem2 = null;
console.log(elem2?.value);

// 5. 널 병합 연산자 (null coalescing operator) : ?? (ECMA2020)
// 좌측 피연산자가 null이나 undefined인 경우 우측 피연산자 반환 그렇지 않으면 좌측 피연산자 값을 반환
let l1 = null ?? 'l1 기본값';
console.log(l1);
let l2 = 3 ?? 'l2 기본값';
console.log(l2);