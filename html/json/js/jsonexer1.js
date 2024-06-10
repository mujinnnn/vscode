window.onload = function() {

    // const = 상수, 변수를 한 번 넣으면 못 바꿈
    /* JSON에서 사용하는 Javascript의 데이터 타입 */
    const obj = {};     // object
    const arr = [];     // array
    const str = "";     // string
    const num = 0;      // number
    const bool = false; // boolean
    const nul = null;   // null

    const result = document.getElementById("result");

    /* JSON Object */
    const person = {
        "name": "홍길동",
        "age": 20,
        "gender": "M",
        "married": false
    };
    person.age = 30; // 값이 변경될 시
    result.innerHTML = person.name + ", " + person.age + ", "
         + person.gender + ", " + person.married;

    /* JSON Array */
    const persons = [ // Array는 뒤에 s, Arr 등을 붙여서 표기를 해줌
        {"name": "강감찬", "age": 60},
        {"name": "장보고", "age": 30},
        {"name": "이순신", "age": 70}
    ];
    persons[1] = {"name": "권율", "age": 80}; // 값이 변경될 시
    result.innerHTML = persons[1].name 
        + ", " + persons[1].age;
    
    const personsLeng = persons.length;
    let printStr = ""; // let : 변수, 값이 계속 바뀌어야하면 let을 씀
    for (let i=0; i<personsLeng; i++) {
        printStr += persons[i].name 
        + ", " + persons[i].age; + "<br />";
    }
    result.innerHTML = printStr;

    // json 형태의 문자열
    const jsonObjStr = '{"name": "홍길동", "age": 20}'; // ''를 붙이므로 문자열
    result.innerHTML = jsonObjStr;
    // result.innerHTML = jsonObjStr.name;

    // json 문자열을 json object로
    const jsonObj = eval("(" + jsonObjStr + ")");
    result.innerHTML = jsonObj.name;

    // json object를 json 문자열로
    const jsonStr = JSON.stringify(jsonObj);
    result.innerHTML = jsonStr;

}