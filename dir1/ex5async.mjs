// fs모듈은 비동기 처리가 기본
// 이 때 결과를 순서대로 출력되도록 하려면 promise 객체를 사용한다.
import { promises } from "fs";

console.log("시작");

promises.readFile('./ex3write.txt')
.then((data) => {
    console.log("1번", data.toString());
    return promises.readFile('./ex3write.txt');
})
.then((data) => {
    console.log("2번", data.toString());
    return promises.readFile('./ex3write.txt');
})
.then((data) => {
    console.log("3번", data.toString());
    return promises.readFile('./ex3write.txt');
})
.catch((err) => {
    console.log("에러", err);
});

console.log("끝")
