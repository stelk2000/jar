EdubookGame.Preloader = function(game) {
    this.preloadBar = null;
    this.loadingScreen = null;
    this.ready = false;
}

EdubookGame.Preloader.prototype = {

    preload: function() {

        this.loadingScreen = this.add.image(0,0, 'loadingScreen');
        this.loadingScreen.anchor.setTo(0, 0);
        //this.loadingScreen.scale.setTo(0.667,0.667);

        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);

        /*
         * Map resources
         */
        this.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tileset', 'assets/maps/timetrip.png');

        /*
         * Image resources
         */
        this.load.image('startScreen', 'assets/images/start_screen.png');
        this.load.image('gameOverScreen', 'assets/images/game_over_screen.png');

        this.load.image('star', 'assets/images/star.png');
        this.load.image('watch', 'assets/images/watch.png');
        this.load.image('bullet','assets/images/bullet.png');
        this.load.image('neandertaler', 'assets/images/neandertaler.png');

        /*
         * Image sprite resources
         */
        this.load.spritesheet('edy_green', 'assets/images/edy_green.png', 32, 64);
        this.load.spritesheet('moveleftbutton', 'assets/images/button_move_left.png', 121, 123);
        this.load.spritesheet('moverightbutton', 'assets/images/button_move_right.png', 121, 123);
        this.load.spritesheet('moveupbutton', 'assets/images/button_move_up.png', 123, 121);

        /*
         * Audio resources
         */
        this.load.audio('sfxstar', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
        this.load.audio('sfxtime', ['assets/audio/time.ogg', 'assets/audio/time.mp3']);
        this.load.audio('sfxstone', ['assets/audio/stone.ogg', 'assets/audio/stone.mp3']);
        //this.load.audio('bgmusic', ['assets/audio/bgmusic.ogg']);

    },

    create: function() {
        this.preloadBar.cropEnabled = false;

        //  Enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    update: function() {
        this.ready = true;
        this.state.start('StartMenu');
    }

}