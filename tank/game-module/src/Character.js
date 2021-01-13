import GameObject from './GameObject';

export default class Character extends GameObject {

    constructor(options) {
        super(options);

        this
        .on('click', onClick);

        function onClick(e) {
            if (!this.dragging){
              console.log('123');
            }

            this.eventManager.notify('set-stats', {
              id: this.id,
              xy: [this.x, this.y]
            })
        }
   }


}