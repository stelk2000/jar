EdubookGame.Game = function(game) {
    this.fx;
    this.player;
    this.cursors;
    this.stars;
    this.watches;
    this.level = 'Level 1';
    this.levelDescription = 'Description';
    this.levelText;
    this.levelDescriptionText;
    this.score = 0;
    this.scoreText;
    this.scoreImage;
    this.timerText;
    this.timerImage;
    this.timerInterval;
    this.sfxStar;
    this.sfxTime;
    this.sfxStone;
    
    this.lastBullet = 0;
    this.bulletSpeed = 300;
    this.playerDirection = "right";

}

// Mobile controls
var moveLeftButton;
var moveRightButton;
var moveUpButton;
var moveLeft = false;
var moveRight = false;
var moveUp = false;


EdubookGame.Game.prototype = {

    create: function() {
        this.buildWorld();
    },

    buildWorld: function() {

        this.map = this.game.add.tilemap('level1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('timetrip', 'tileset');

        //create layers
        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');

        //collision on blockedLayer
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

        //resizes the game world to match the layer dimensions
        this.backgroundLayer.resizeWorld();

        //create stars
        this.createStars();

        //create watches
        this.createWatches();

        this.world.setBounds(0, 0, 4096, 1536);

        /**
         * Audio FX
         */
        this.sfxStar = this.add.audio('sfxstar');
        this.sfxTime = this.add.audio('sfxtime');
        this.sfxStone = this.add.audio('sfxstone');


        // The player and its settings
        this.player = this.game.add.sprite(32, this.world.height - 250, 'edy_green');
        this.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 1000;
        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [14, 15, 16, 14], 8, true);
        this.player.animations.add('right', [1, 0, 3, 0], 8, true);
        this.player.animations.add('dizzy', [4,9], 10, true);

        this.player.isDizzy = false;

        // camera settings
        this.camera.follow(this.player);
        
        
        // Bullets
        this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(10,'bullet');			
    	this.bullets.setAll('outOfBoundsKill', true);
    	this.bullets.setAll('checkWorldBounds', true);
    	

        // Buttons to move the player on mobile devices
        moveLeftButton = this.game.add.button(20, this.game.height - 60, 'moveleftbutton', null, this, 1, 0, 1, 0);
        moveLeftButton.scale.setTo(0.4, 0.4);
        moveLeftButton.fixedToCamera = true;
        moveLeftButton.events.onInputOver.add(function(){ moveLeft = true; });
        moveLeftButton.events.onInputOut.add(function(){ moveLeft = false; });
        moveLeftButton.events.onInputDown.add(function(){ moveLeft = true; });
        moveLeftButton.events.onInputUp.add(function(){ moveLeft = false; });

        moveRightButton = this.game.add.button(120, this.game.height - 60, 'moverightbutton', null, this, 1, 0, 1, 0);
        moveRightButton.scale.setTo(0.4, 0.4);
        moveRightButton.fixedToCamera = true;
        moveRightButton.events.onInputOver.add(function(){ moveRight = true; });
        moveRightButton.events.onInputOut.add(function(){ moveRight = false; });
        moveRightButton.events.onInputDown.add(function(){ moveRight = true; });
        moveRightButton.events.onInputUp.add(function(){ moveRight = false; });

        moveUpButton = this.game.add.button(this.game.width - 60, this.game.height - 60, 'moveupbutton', null, this, 1, 0, 1, 0);
        moveUpButton.scale.setTo(0.4, 0.4);
        moveUpButton.fixedToCamera = true;
        moveUpButton.events.onInputOver.add(function(){ moveUp = true; });
        moveUpButton.events.onInputOut.add(function(){ moveUp = false; });
        moveUpButton.events.onInputDown.add(function(){ moveUp = true; });
        moveUpButton.events.onInputUp.add(function(){ moveUp = false; });


        //  The HUD
        this.levelText = this.add.text(16, 16, this.level, { fontSize: 20, fill: 'white'});
        this.levelText.fixedToCamera = true;

        this.levelDescriptionText = this.add.text(120, 16, this.levelDescription, { fontSize: 20, fill: 'yellow' });
        this.levelDescriptionText.fixedToCamera = true;

        this.timerImage = this.add.image(360, 12, 'watch');
        this.timerImage.fixedToCamera = true;

        this.timer = 100;
        this.timerText = this.add.text(400, 16, this.timer.toString() , { fontSize: 20, fill: 'white' });
        this.timerText.fixedToCamera = true;

        this.scoreImage = this.add.image(460, 12, 'star');
        this.scoreImage.fixedToCamera = true;

        this.scoreText = this.add.text(500, 16, this.score.toString(), { fontSize: 20, fill: 'white' });
        this.scoreText.fixedToCamera = true;

        //create countdown
        /*
        var that = this;
        this.timerInterval = setInterval(function() {
            that.timer--;
            that.timerText.setText(that.timer);

            if(!that.timer) {
                that.gameOver();
            }
        }, 1000);
        */


        //  Our controls.
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {

        this.physics.arcade.collide(this.player, this.blockedLayer);
        
        this.physics.arcade.collide(this.stars, this.blockedLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.arcade.overlap(this.player, this.watches, this.collectTime, null, this);
        
        this.physics.arcade.overlap(this.bullets, this.blockedLayer, this.bulletOverlapBlocked, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if ((this.cursors.left.isDown || moveLeft) && !this.player.isDizzy) {
            //  Move to the left
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
            this.playerDirection = "left";
        }
        else if ((this.cursors.right.isDown || moveRight) && !this.player.isDizzy) {
            //  Move to the right
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
            this.playerDirection = "right";
        }
        else if (this.player.isDizzy) {
            this.player.animations.play('dizzy');
        }
        else {
            //  Stand still
            this.player.animations.stop();
            this.player.frame = 4;
        }
        
        var curTime = this.game.time.now;
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				if (curTime - this.lastBullet > 300) {
					this.fireBullet();
					this.lastBullet = curTime;
					
				}
			}

        // sprite when player is in the air
        /*if (this.cursors.up.isDown || moveUp || !this.player.body.blocked.down) {
            this.player.frame = 8;
        }*/

        //  Allow the player to jump if they are touching the ground.
        if ((this.cursors.up.isDown || moveUp) && this.player.body.blocked.down && !this.player.isDizzy) {
            //this.player.frame = 8;
            this.player.body.velocity.y = -600;
        }
    },

    render: function() {
        this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    },
    
    fireBullet : function(curTime) {
		var bullet = this.bullets.getFirstExists(false);
		if (bullet) {
			
			if (this.playerDirection == "right") {
			bullet.reset(this.player.x + this.player.width, this.player.y + this.player.height/2);
				bullet.body.velocity.x = this.bulletSpeed;
			} else {
			bullet.reset(this.player.x, this.player.y + this.player.height/2);
				bullet.body.velocity.x = - this.bulletSpeed;
			}
		}
	},

    gameOver: function() {
        clearInterval(this.timerInterval);
        this.state.start('GameOver');
    },

    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layerName) {
        var result = new Array();
        map.objects[layerName].forEach(function(element){
            if(element.properties.type === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    // create stars
    createStars: function() {
        this.stars = this.game.add.group();
        this.stars.enableBody = true;
        var result = this.findObjectsByType('neandertaler', this.map, 'objectsLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.stars);
        }, this);
    },

    // create watches
    createWatches: function() {
        this.watches = this.game.add.group();
        this.watches.enableBody = true;
        var result = this.findObjectsByType('time', this.map, 'objectsLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.watches);
        }, this);
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);
        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
        this.physics.arcade.enable(sprite);
        sprite.body.bounce.y = 0.2;
        sprite.body.gravity.y = 1000;
    },

    bulletOverlapBlocked: function(bullet, blocked) {
    	// play sound
        //this.sfxStar.play();
        
        bullet.kill();
    },

    collectStar: function(player, collectable) {
    	// play sound
        this.sfxStar.play();
        // score up
        this.score += 10;
        // update scoreboard
        this.scoreText.text = this.score.toString();
        // kill star
        collectable.destroy();
    },

    collectTime: function(player, collectable) {
        this.sfxTime.play();
        this.timer += 10;
        this.timerText.setText(this.timer);
        collectable.destroy();
    }
}




