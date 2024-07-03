// Promise
// - 자바스크립트 언어는 코드를 위에서 아래로 한 줄씩 순차적으로 실행함
// - 그래서 비동기 작업(XMLHttpRequest)이나 타이머 작업(setTimeout, setInterval)을
//   수행할 때 다음 줄의 코드들이 먼저 수행되는 고질적 문제가 있음
// - 콜백헬(callback hell) : 코드 실행 순서를 보장하기 위해서 콜백 함수를 사용하게 되는데 순서를 보장할 코드가 늘어나면
//                           콜백 함수의 수가 늘어나서 코드의 복잡도가 높아지는 문제가 있다. 이를 콜백헬이라 함
// - 이전 코드의 수행 결과(성공 또는 실패)를 다음 코드에서 보장(약속)받아 수행하게 하기 위해 ES6에 Promise가 추가됨
// - 성공 => resolve 함수 사용, 실패 => reject 함수 사용

// 비동기 처리가 완료되고 다음 작업이 수행되도록 콜백 처리함
/*
const get = url => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            successCallback(JSON.parse(xhr.response));
        } else {
            failureCallback(xhr);
        }
    };
};
get('http://jsonplaceholder.typicode.com/posts/1');

const successCallback = (todos) => {
    console.log(todos);
    document.querySelector("#result").innerHTML
         = JSON.stringify(todos);
};

const failureCallback = (xhr) => {
    console.log(`${xhr.status} ${xhr.statusText}`);
    document.querySelector("#result").innerHTML
         = `${xhr.status} ${xhr.statusText}`;
};
*/

// Promise 사용
/*
const get = url => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.response));
                document.querySelector("#result").innerHTML
                    = JSON.stringify(todos);
            } else {
                reject(`${xhr.status} ${xhr.statusText}`);
                document.querySelector("#result").innerHTML
                    = `${xhr.status} ${xhr.statusText}`;
            }
        };
    })
};
get('http://jsonplaceholder.typicode.com/posts/1');
*/

// Promise 상태
// 1. pending : 프라미스 객체가 생성된 상태
/*
const pending = new Promise(() => {});
onsole.log(pending); // pending 상태
*/
// 2. fullfilled : 비동기 요청이 성공한 상태
/*
const fullfilled = new Promise(resolve => resolve('성공'));
console.log(fullfilled); // fullfilled 상태
*/
// 3. rejected : 비동기 요청이 실패한 상태
/*
const rejected = new Promise((_, reject) => reject(new Error('에러')));
console.log(rejected); // rejected 상태
*/

// Promise 후속처리 메소드
// then : 성공 후에 호출
// catch : 실패 후에 호출
// finally : 성공하든 실패하든 호출
const get = url => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.response));
                document.querySelector("#result").innerHTML
                    = JSON.stringify(todos);
            } else {
                reject(`${xhr.status} ${xhr.statusText}`);
                document.querySelector("#result").innerHTML
                    = `${xhr.status} ${xhr.statusText}`;
            }
        };
    });
};
get('http://jsonplaceholder.typicode.com/posts/1')
.then(result => console.log(result))
.catch(error => console.error(error))
.finally(() => console.log('성공하든 실패하든 수행'));