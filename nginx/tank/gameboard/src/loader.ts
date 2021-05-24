
export default class Loader extends PIXI.Loader {
    private queue: LoaderRequest[];
    private is_locked: boolean;
    
    constructor() {
        super()
        this.queue = []
        this._loadFromQueue = this._loadFromQueue.bind(this)
        this.onComplete.add(this._loadFromQueue);
    }
    
    loadMany(request: LoaderRequest) {
        this.queue.push(request);
        if (!this.is_locked) {
            this.is_locked = true;
            this._loadFromQueue();
        }
    }

    isLoaded(resource:  { name: string; url: string; }) {
        // If resource has already been loaded, not doing it again
        return typeof this.resources[resource.name] !== 'undefined';
    }
    
    private _loadFromQueue() {
        if (this.queue.length > 0) {
            var request = this.queue.pop();
            this._addMany(request.resources);
            
            this.onLoad.once(() => {
                request.callback(this, this.resources)     
            })
            
            this.load()
        }
        else
            this.is_locked = false;
    }

    private _addMany(resources: { name: string; url: string; }[]) {
        let flag = false;
        for (let res of resources) {
            if (!this.isLoaded(res)) {
                flag = true;
                this.add(res); 
            }
        }
    }  
}