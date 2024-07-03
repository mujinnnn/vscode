// async / await
// async : 비동기 함수 선언하는 키워드
// await : 비동기 함수 내에서 블락킹(수행 종료까지 대기)하는 키워드

// 비동기 함수 내에서 동기(직렬) 처리
/*
async function afunc() {
    const a = await new Promise(resolve => setTimeout(() => resolve(1), 3000));
    const b = await new Promise(resolve => setTimeout(() => resolve(2), 2000));
    const c = await new Promise(resolve => setTimeout(() => resolve(3), 1000));
    console.log([a, b, c]);
}
const now = Date.now();
afunc()
.then(() => console.log(Date.now() - now));
*/

// 비동기 함수 내에서 비동기(병렬) 처리
/*
async function afunc2() {
    const result = await Promise.all([
        await new Promise(resolve => setTimeout(() => resolve(1), 3000)),
        await new Promise(resolve => setTimeout(() => resolve(2), 2000)),
        await new Promise(resolve => setTimeout(() => resolve(3), 1000))
    ]);
    console.log(result);
}
const now2 = Date.now2();
afunc2()
.then(() => console.log(Date.now2() - now2)); // 대략 3초
*/

// await 선택적 사용
const afunc3 = async function(x) {
    let sum = 0;
    sum += await x + 1; // 2
    // 즉시 실행 함수는 동기/비동기 영향을 받지 않음
    // 즉시 실행 함수 앞에 await를 사용하는 건 아무 의미가 없음
    sum += setTimeout(() => (() => {
        console.log(x);
        return x * 2;
    })(), 3000); // 4
    sum += await x + 1; // 6
    console.log(sum);
};
afunc3(1);