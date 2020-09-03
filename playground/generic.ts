interface Man {
  // sum: (a: number, b: number) => number;
  sum(a: number, n: number): number;
  name: string;
  age: number;
  isMarried: boolean;
  // sum?<T extends number>(a: T, b: T): T;
}
let man: Man;
man = {
  name: "sufi",
  age: 12,
  isMarried: true,
  sum(num: number, num2: number) {
    return num + num2;
  },
};
// man.age = 23;
man.sum = (a: number, b: number) => a + b;
let meme: Partial<Man> = {};
// meme = {};
meme.age = 12;
// meme.sum = (x, y) => x + y;

// console.log(meme, "\n", man);
// console.log(JSON.stringify(man, undefined, 1));
// function Minus<T>(big: T, small: T): T {
//   return big + small;
// }
// const res = Minus<number>(8, 8);
// console.log(res);
class Umu implements Man {
  all: number[] = [11];
  constructor(
    public name: string,
    public age: number,
    public isMarried: boolean,
    private log: number = 72
  ) {}
  sum(a: number, b: number) {
    return a + b;
  }
  print() {
    this.log = 12;
    return this.log;
  }
  exec() {}
}

const umu = new Umu("suffix", 23, true);
umu.all.push(2, 1, 3);
// console.log(umu.print(), umu.all);
let lost: Man;
lost = {
  age: 12,
  isMarried: false,
  name: "na me",
  sum(a, b) {
    return a + b;
  },
};
// const exec = <f>(a: f, b: f) => Object.assign(a, b);
interface Lengthy {
  length: number;
  // push(a: number[]): number;
}
const exec = <f extends number[], h extends Lengthy>(a: f, b: h) => [a, b];
const res = exec([21, 21], [87]);
// console.log(res);
// console.log([23].push(3, 5));

// lost.age = 213;
// lost.next = 21;
// console.log(lost.sum(2, 1));

class DataMe<T> {
  private list: Array<T> = [];
  add(a: T) {
    this.list.push(a);
    return this;
  }
  getList() {
    return this.list;
  }
  remove(item: T) {
    return this.list.splice(this.list.indexOf(item), 1);
  }
}

const w = new DataMe<string>();
w.add("ha").add("qw").add("push");
console.log(w.getList());
