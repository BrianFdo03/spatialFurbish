const greeting: string = "Hello, TypeScript!";

function sayHello(name: string): string {
  return `${greeting} My name is ${name}.`;
}

const message: string = sayHello("Lakmal");

console.log(message);
