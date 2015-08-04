EdubookGame.GameOver = function(game) {
    this.gameOverScreen;
}

EdubookGame.GameOver.prototype = {

    create: function() {
        this.gameOverScreen = this.add.image(0, 0, 'gameOverScreen');
        this.gameOverScreen.scale.setTo(0.667,0.667);
        this.gameOverScreen.inputEnabled = true;
        this.gameOverScreen.events.onInputDown.addOnce(this.showStartMenu, this);
    },

    showStartMenu: function(pointer) {
        this.state.start('StartMenu');
    }
}