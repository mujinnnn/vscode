// 1. function 문법 component
/*
export function ReactComponent() {
    const message = 'Function문법 Component';
    return {
        <h1>{message}</h1>
    };
}
*/

// 2. class 문법 component
import { Component } from "react";
export default class ReactComponent extends Component {
    render() {
        const message = 'Class문법 Component';
        return (
            <h1>{message}</h1>
        );
    }
}