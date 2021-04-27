export default class Factory {
    constructor() {
        this.current = -1;
        this.pool = [];
        this.isDisposed = false;
    }
    add(elementName) {
        this.current += 1;
        if(this.current === this.pool.length){
            const element = document.createElementNS("http://www.w3.org/2000/svg", elementName);
            this.pool.push(element);
            return element;
        } else {
            return this.pool[this.current];
        }
    }
    clear() {
        this.pool.forEach(element => {
            element.remove();
        })
        this.current = -1;
    }
    disposed (){
        this.clear();
        this.pool.length = 0;
        this.pool = null;
    }
}