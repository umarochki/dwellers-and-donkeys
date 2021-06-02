import { Component, Message } from '../libs/pixi-ecs'
import Loader from '../loader';

export default class LoaderSystem extends Component {
    loader: Loader

    constructor(loader: Loader) {
        super()
        this.loader = loader
    }
     
    onInit() {
        this.subscribe('loader/add')
    }

    onMessage(msg: Message) {
        if (msg.action == 'loader/add') {
            this.loader.loadMany(msg.data)
        }
    }
}
