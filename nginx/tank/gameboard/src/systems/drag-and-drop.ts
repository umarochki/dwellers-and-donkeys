import { Component, Scene } from '../libs/pixi-ecs'

export default class DragAndDrop {
    scene: Scene
    private component: DragAndDropComponent
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.component = new DragAndDropComponent();
        this.scene.addGlobalComponentAndRun(this.component);
    }

    // Reset drag event handlers if draggable DOM-elements were recreated
    reset() {
        Array.prototype.map.call(document.querySelectorAll('[draggable="true"]'),
            (element) => {
                element.removeEventListener('dragstart', (e) => this.component.obj = e.target );
                element.addEventListener('dragstart', (e) => this.component.obj = e.target );
            }
        );
    }
}

class DragAndDropComponent extends Component {
    // Currently dragged DOM object: can become a game object if dropped on the game map
    obj: HTMLImageElement | undefined
    // Listener to detect currently dragged DOM object
    private listener: (e: DragEvent) => void = function(e) { 
        this.obj = e.target as HTMLImageElement
    }

    constructor() {
        super()
        this.listener = this.listener.bind(this)
        this.onDrop = this.onDrop.bind(this)
    }
    
    onAttach() {
        // Add drag event handlers to draggable DOM-elements
        Array.prototype.map.call(document.querySelectorAll('[draggable="true"]'),
            (element) => {
                element.addEventListener('dragstart', this.listener)
            }
        );

        // Add drop behavior on PIXI application
        this.scene.app.view.addEventListener('drop', this.onDrop);
    }

    onDetach() {
        // Add drag event handlers to draggable DOM-elements
        Array.prototype.map.call(document.querySelectorAll('[draggable="true"]'),
            (element) => {
                element.removeEventListener('dragstart', this.listener)
            }
        );

        // Add drop behavior on PIXI application
        this.scene.app.view.removeEventListener('drop', this.onDrop);
    }

    onDrop(e: DragEvent) {
        // Check if currently dragged object exists
        if (!this.obj) return;

        this.sendMessage('object/add', {
            type: this.obj.getAttribute('data-type') || 'none',
            sprite: this.obj.src, 
            xy: [(e.offsetX - this.scene.viewport.x) / this.scene.viewport.scale.x, 
                (e.offsetY - this.scene.viewport.y) / this.scene.viewport.scale.y]
        } as ObjectOptions)

        this.obj = undefined;
    }
}