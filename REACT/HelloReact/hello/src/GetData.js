import { useState } from 'react';

export default function GetData() {

    const [data, setData] = useState('');

    return (
        <>
            <select onClick='{loadData}'>
                <option value=''>--전체--</option>
            </select>
            <p>
                <span id='result'>{data}</span>
            </p>
        </>
    );

    function loadData(id) {
        const url = id ? 'https://jsonplaceholder.typicode.com/todos' + id : https://jsonplaceholder.typicode.com/todos;
        fetch('https://jsonplaceholder.typicode.com/todos' + id)
        .then(response => response.json())
        .then(result => setData(JSON.stringify(result)));
    }

}