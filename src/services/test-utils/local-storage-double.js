export class FakeLocalStorage {
  storage = {};
  setItem = (name, value) => {
    this.storage[name] = value;
  };
  getItem = (name) => {
    return this.storage[name];
  };
}
