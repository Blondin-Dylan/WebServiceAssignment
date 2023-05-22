export default async (callback) => {
    let res = await fetch("https://localhost:7777/tennis") 
    let tennisPin = await res.json();
    callback(tennisPin);
}