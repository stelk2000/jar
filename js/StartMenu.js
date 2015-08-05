EdubookGame.StartMenu = function(game) {
    this.startScreen;
}

EdubookGame.StartMenu.prototype = {

    create: function() {
        this.startScreen = this.add.image(0, 0, 'startScreen');
        //this.startScreen.scale.setTo(0.667,0.667);
        this.startScreen.inputEnabled = true;
        this.startScreen.events.onInputDown.addOnce(this.startGame, this);
    },

    startGame: function(pointer) {

        //go to fullscreen mode if supported
        /*this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            //resets alignment and enters fullscreen
            //not needed if alignment isn't changed to true beforehand
            this.game.scale.setMaximum();
            this.game.scale.setScreenSize(true);
            this.game.scale.pageAlignVertically = false;
            this.game.scale.pageAlignHorizontally = false;
            this.game.scale.startFullScreen(false); //true=antialiasing ON, false=antialiasing off
        }*/

        this.state.start('Game');
    }
}