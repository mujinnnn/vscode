/* this */

// this : 현재 메모리에서 참조되고 있는 객체 자신
// this binding : this 식별자와 this가 가리키는 객체

// 객체리터럴에 정의된 메소드 내에서의 this는 메소드를 호출한 객체

// 생성자 함수 내에서의 this는 생성자 함수가 생성할 객체

// 자바스크립트의 this는 함수 호출방식에 따라서 가리키는 객체가 결정됨
// = 동적바인딩 (dynamic binding)

// 전역에서 this
//  1) 웹브라우저 환경이면 this는 window
//  2) 노드 환경이면 this는 global 또는 globalThis

// 함수 선언문 내에서 this는 전역객체
// (단, strict mode일 때는 함수 선언문에서 this는 undefined)

// 콜백함수가 일반함수로 호출되면 콜백함수 내에서의 this는 전역객체

// 메소드 내에 있는 일반함수의 this는 전역객체
// 메소드 내에 있는 일반함수의 this를 메소드를 호출한 객체로 바인딩하려면...
//  1) 일반함수 바깥에서 다른 변수에 this를 담아서 다른 변수를 일반함수 안에서 사용
//  2) call, apply, bind 메서드로 일반함수 내의 this를 메소드 호출 객체로 바인딩해준다.
//  3) 일반함수 말고 화살표함수를 사용하면 화살표함수 내의 this는 메소드를 호출한 객체

// this : 현재 메모리에서 참조되고 있는 객체 자신

////////////////
// node 환경에서
////////////////

// 전역 스코프에서의 this
console.log(this); // ()

// 일반함수(선언적 함수)에서의 this
function add(a, b) {
    console.log(this); // global
    return a + b;
}
add(3, 5);

// 생성자 함수에서의 this
function Person(name, age) {
    this.name = name;
    this.age = age;
    console.log(this); // new Person('홍길동', 30)
};
const person = new Person('홍길동', 30);

// 메소드 내에서의 this
const hong = {
    name: '홍길동',
    age: 30,
    printThis() {
        console.log(this); // hong 객체
    }
};
hong.printThis();

// 콜백함수 내에서의 this
const kang = {
    name: '강감찬',
    age: 20,
    printThis() {

        console.log(); // 강감찬
        const that = this;

        // 콜백함수 내에서의 this는 전역객체
        setTimeout(function() {
            console.log(this.name); // undefined
        }, 100);

        // 메소드에서 this를 that에 담아서 that을 통해 kang객체와 this를 바인딩
        setTimeout(function() {
            console.log(that.name); // 강감찬
        }, 100);

        // bind 메소드를 사용해 콜백함수 내의 kang객체의 this를 바인딩
        setTimeout(function() {
            console.log(this.name); // 강감찬
        }.bind(this), 100);
        
        // 콜백함수를 화살표 함수를 사용하면 콜백함수 내의 this문제가 해결됨
        // => 콜백함수 내의 this는 콜백함수를 호출한 객체
        setTimtout(() => console.log(this.name), 100);

    }
};
kang.printThis();

/* 

    이벤트 핸들러 내에서의 this는 이벤트 타겟 객체

    // btn : 이벤트 타겟 객체, onclick : 이벤트 속성, 이벤트 명 : click
    // function() {} : 이벤트 핸들러(=이벤트 리스너)
    btn.onclick = function() {
        console.log(this); // btn
    };

*/