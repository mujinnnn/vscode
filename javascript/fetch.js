// fetch
// 자바스크립트에서 비동기 처리를 간편하게 하기 위해 고안

// get
/*
fetch('http://jsonplaceholder.typicode.com/users')
.then(response => response.json())
.then(json => { // json 객체
    console.log(json);
    console.log(json.length);
});
*/

// post
/*
fetch('http://jsonplaceholder.typicode.com/todos',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId: 1,
            title: 'Javascript',
            completer: false
        })
    }
)
.then(response => response.json())
.then(todos => console.log(todos))
.catch(err => console.log(err));
*/

// put / patch
/*
fetch('http://jsonplaceholder.typicode.com/todos',
    {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId: 1,
            title: 'React',
            completer: true
        })
    }
)
.then(response => response.json())
.then(todos => console.log(todos))
.catch(err => console.log(err));
*/

// delete
/*
fetch('http://jsonplaceholder.typicode.com/todos/1',
    { method: 'DELETE' })
.then(response => response.json())
.then(todos => console.log(todos))
.catch(err => console.log(err));
*/