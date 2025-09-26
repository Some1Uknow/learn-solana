import * as Phaser from "phaser";
import { SOLANA_QUESTIONS } from "./SolanaClickerUtils";

// Event name exported so React wrapper can subscribe
export const GAME_COMPLETE_EVENT = "gameComplete";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private levelComplete = false;
  private currentLevel = 1;
  private maxLevels = 5;
  private questionUI: Phaser.GameObjects.Container | null = null;
  private quizIndex = 0;
  private isShowingQuiz = false;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { level?: number; totalScore?: number }) {
    this.currentLevel = data.level || 1;
    this.score = data.totalScore || 0;
    this.levelComplete = false;
    this.isShowingQuiz = false;
    this.quizIndex = (this.currentLevel - 1) % SOLANA_QUESTIONS.length;
  }

  preload() {
    // Player spritesheet (same as before)
    this.load.spritesheet(
      "playerSheet",
      "/game-assets/solana-clicker/sprite-sheet-1.png",
      {
        frameWidth: 216,
        frameHeight: 296,
      }
    );

    // Tilesheet (your 2x5 grid, 32x32 each)
    this.load.spritesheet(
      "tiles32",
      "/game-assets/solana-clicker/platform_tilesheet.png",
      {
        frameWidth: 204, // instead of 32
        frameHeight: 204,
      }
    );

    // Coin sheet (your 2x2 grid, 64x64 each)
    this.load.spritesheet(
      "solCoin",
      "/game-assets/solana-clicker/solana_coin.png",
      {
        frameWidth: 256, // instead of 64
        frameHeight: 256,
      }
    );

    // Goal (green portal)
    this.load.image("goalImg", "/game-assets/solana-clicker/goal.png");

    // Quiz UI panel
    this.load.image("uiPanel", "/game-assets/solana-clicker/ui_panel.png");

    // Backgrounds
    this.load.image("bg_level1", "/game-assets/solana-clicker/bg_level1.png");
    this.load.image("bg_level2", "/game-assets/solana-clicker/bg_level2.png");
    this.load.image("bg_level3", "/game-assets/solana-clicker/bg_level3.png");
    this.load.image("bg_level4", "/game-assets/solana-clicker/bg_level4.png");
    this.load.image("bg_level5", "/game-assets/solana-clicker/bg_level5.png");

    // Create graphics textures instead of loading images
    this.createTextures();
  }

  createTextures() {
    // Legacy ground & placeholder textures removed since tilesheet now drives visuals
    // (Leave method in case future procedural textures are needed.)
    // Create star texture (glow behind coins)
    const starGraphics = this.add.graphics();
    starGraphics.fillStyle(0xffd700);
    starGraphics.fillCircle(16, 16, 16);
    starGraphics.generateTexture("star", 32, 32);
    starGraphics.destroy();
  }

  create() {
    // Background image per level
    const bgKey = `bg_level${this.currentLevel}`;
    this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height / 2, bgKey)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Level indicator
    this.add
      .text(400, 30, `Level ${this.currentLevel} of ${this.maxLevels}`, {
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.createPlayer();
    this.createLevel();
    this.createStars();
    this.createUI();
    this.setupPhysics();
    this.setupInput();
    // Enable physics debug overlay to visualize hitboxes (helps tune sizes)
    (this.physics.world as any).drawDebug = true;
    (this.physics.world as any).debugGraphic = this.add
      .graphics()
      .setAlpha(0.75);
  }
  createPlayer() {
    this.player = this.physics.add.sprite(80, 450, "playerSheet", 0);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.player.setScale(0.3);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(80, 200);
      body.setOffset(80, 100);
      body.updateFromGameObject();
    }

    // ✅ Animations (all on playerSheet)
    // IDLE
    this.anims.create({
      key: "idle",
      frames: [{ key: "playerSheet", frame: 0 }],
      frameRate: 1,
      repeat: -1,
    });

    // RUN (right-facing frames 4–6)
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        start: 4,
        end: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // JUMP (use 13 for airborne)
    this.anims.create({
      key: "jump",
      frames: [{ key: "playerSheet", frame: 13 }],
      frameRate: 1,
    });

    // FALL (use 10 for falling forward)
    this.anims.create({
      key: "fall",
      frames: [{ key: "playerSheet", frame: 10 }],
      frameRate: 1,
    });

    // CELEBRATE (cycle 2–3)
    this.anims.create({
      key: "celebrate",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.player.play("idle");
  }

  setupInput() {
    // Create cursor keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Add WASD keys as alternative
    const wasd = this.input.keyboard!.addKeys("W,S,A,D");

    // Store both control schemes
    (this as any).wasd = wasd;
  }

  // Frame map in the tilesheet (4x2 grid we made):
  // 0=platform_left, 1=platform_center, 2=platform_right, 3=platform_top,
  // 4=platform_tl, 5=platform_tr, 6=hover_pad
  // Add a single tile
  private addTile(x: number, y: number, frame: number) {
    const TILE_SIZE = 64; // final size we want

    const spr = this.add.sprite(x, y, "tiles32", frame).setOrigin(0, 0);

    // Use setDisplaySize instead of scale to guarantee pixel alignment
    spr.setDisplaySize(TILE_SIZE, TILE_SIZE);

    this.physics.add.existing(spr, true);

    const body = spr.body as Phaser.Physics.Arcade.StaticBody;
    if (body) {
      // hitbox = exactly display size
      body.setSize(TILE_SIZE, TILE_SIZE);
      body.setOffset(0, 0);

      // Refresh body after resize
      body.updateFromGameObject();
    }

    this.platforms.add(spr);
    return spr;
  }

  // Place a row of the SAME tile type
  private placeRow(
    startX: number,
    y: number,
    tileCount: number,
    frame: number = 0
  ) {
    const TILE_SIZE = 64; // display size
    for (let i = 0; i < tileCount; i++) {
      this.addTile(startX + i * TILE_SIZE, y, frame);
    }
  }

  private placePad(x: number, y: number) {
    // A single hover pad (nice floating step)
    this.addTile(x, y, 6);
  }

  // Map each level to a primary block frame from the tilesheet
  // Attachment order (left->right in provided image) assumed frames:
  // 0: Grass (Level 1), 1: Wood (Level 2), 2: Water/Ice (Level 3), 3: Metal (Level 4), 4: Autumn Grass (Level 5)
  private frameForLevel(level: number): number {
    const mapping: Record<number, number> = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
    };
    return mapping[level] ?? 0;
  }

  // Convenience to center a row horizontally given tile count
  private placeCenteredRow(y: number, tileCount: number, frame: number) {
    const TILE_SIZE = 64;
    const totalWidth = tileCount * TILE_SIZE;
    const startX = 400 - totalWidth / 2; // assuming 800 width
    this.placeRow(startX, y, tileCount, frame);
  }

  createLevel() {
    this.platforms = this.physics.add.staticGroup();
    switch (this.currentLevel) {
      case 1:
        this.createLevel1();
        break;
      case 2:
        this.createLevel2();
        break;
      case 3:
        this.createLevel3();
        break;
      case 4:
        this.createLevel4();
        break;
      case 5:
        this.createLevel5();
        break;
      default:
        this.createLevel1();
    }
  }

  createLevel1() {
    // Big ground row (all grass blocks = frame 0)
    this.placeRow(0, 568, 13, 0);

    // Floating platforms (shorter rows, can mix frames for variety)
    this.placeRow(200, 480, 3, 0);
    this.placeRow(600, 380, 3, 0);
    this.placeRow(700, 280, 2, 0);

    // Hover pads (maybe use stone frame = 6, or purple pad = 7)
    this.addTile(520, 520, 6);
    this.addTile(420, 440, 6);

    // Goal
    this.createGoal(700, 250);
  }

  createLevel2() {
    const f = this.frameForLevel(2);
    // Ground
    this.placeRow(0, 568, 13, f);
    // Staggered rising platforms
    this.placeRow(120, 500, 3, f);
    this.placeRow(320, 420, 3, f);
    this.placeRow(520, 340, 3, f);
    this.placeRow(660, 260, 2, f);
    this.createGoal(700, 230);
  }

  createLevel3() {
    const f = this.frameForLevel(3);
    this.placeRow(0, 568, 13, f);
    this.placeRow(80, 480, 3, f);
    this.placeRow(360, 400, 3, f);
    this.placeRow(140, 320, 3, f);
    this.placeRow(460, 240, 3, f);
    this.placeRow(660, 180, 2, f);
    this.createGoal(700, 150);
  }

  createLevel4() {
    const f = this.frameForLevel(4);
    this.placeRow(0, 568, 13, f);
    // Symmetric challenge layout
    this.placeRow(100, 480, 3, f);
    this.placeRow(600, 480, 3, f);
    this.placeRow(300, 380, 5, f);
    this.placeRow(80, 280, 3, f);
    this.placeRow(620, 280, 3, f);
    this.placeRow(300, 180, 4, f);
    this.createGoal(400, 150);
  }

  createLevel5() {
    const f = this.frameForLevel(5);
    this.placeRow(0, 568, 13, f);
    this.placeRow(80, 500, 3, f);
    this.placeRow(280, 440, 3, f);
    this.placeRow(480, 380, 3, f);
    this.placeRow(640, 320, 2, f);
    this.placeRow(440, 260, 3, f);
    this.placeRow(240, 200, 3, f);
    this.placeRow(440, 140, 4, f);
    this.createGoal(480, 110);
  }

  createGoal(x: number, y: number) {
    const goal = this.add.image(x, y, "goalImg").setOrigin(0.5);
    goal.setDisplaySize(60, 60);

    this.tweens.add({
      targets: goal,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.physics.add.existing(goal, true);
    this.physics.add.overlap(
      this.player,
      goal,
      this.reachGoal,
      undefined,
      this
    );
  }

  createStars() {
    const positions = this.getStarPositions();
    this.coins = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Create coin spin animation with correct frame count (4 frames)
    this.anims.create({
      key: "coinSpin",
      frames: this.anims.generateFrameNumbers("solCoin", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
      yoyo: false,
    });

    // Also create a simple fallback animation if the first one fails
    this.anims.create({
      key: "coinSimple",
      frames: [{ key: "solCoin", frame: 0 }],
      frameRate: 1,
      repeat: -1,
    });

    positions.forEach((pos) => {
      // Add a subtle glow effect behind the coin
      const glow = this.add.circle(pos.x, pos.y, 26, 0xffdd00, 0.3);
      glow.setDepth(-1); // Place it behind the coin

      // Create the animated coin sprite
      const c = this.coins.create(
        pos.x,
        pos.y,
        "solCoin",
        0
      ) as Phaser.Physics.Arcade.Sprite;
      c.setScale(0.08); // Adjusted scale for 256x256 coin

      // Add a subtle pulsing effect to make coins more noticeable
      this.tweens.add({
        targets: c,
        scale: 0.2,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      try {
        c.play("coinSpin");
      } catch (err) {
        console.error("Error playing coin animation:", err);
        // Fall back to using frame 0
        c.setTexture("solCoin", 0);
      }

      // Type safety check for body property
      if (c.body) {
        c.body.setCircle(20, 10, 10); // Adjusted pickup circle size for scaled coin
      }
    });
  }

  getStarPositions() {
    switch (this.currentLevel) {
      case 1:
        return [
          { x: 120, y: 530 },
          { x: 200, y: 430 },
          { x: 600, y: 330 },
          { x: 500, y: 530 },
        ];
      case 2:
        return [
          { x: 80, y: 530 },
          { x: 150, y: 450 },
          { x: 350, y: 370 },
          { x: 550, y: 290 },
          { x: 300, y: 530 },
        ];
      case 3:
        return [
          { x: 50, y: 530 },
          { x: 120, y: 430 },
          { x: 400, y: 350 },
          { x: 180, y: 270 },
          { x: 500, y: 190 },
          { x: 600, y: 530 },
        ];
      case 4:
        return [
          { x: 100, y: 530 },
          { x: 150, y: 430 },
          { x: 650, y: 430 },
          { x: 400, y: 330 },
          { x: 120, y: 230 },
          { x: 680, y: 230 },
          { x: 500, y: 530 },
        ];
      case 5:
        return [
          { x: 60, y: 530 },
          { x: 120, y: 450 },
          { x: 320, y: 390 },
          { x: 520, y: 330 },
          { x: 680, y: 270 },
          { x: 480, y: 210 },
          { x: 280, y: 150 },
          { x: 400, y: 530 },
        ];
      default:
        return [
          { x: 200, y: 430 },
          { x: 600, y: 330 },
        ];
    }
  }

  createUI() {
    // ✅ Use camera-relative positioning to prevent cropping on different resolutions
    this.scoreText = this.add
      .text(16, 16, `SOL: ${this.score}`, {
        fontSize: "28px",
        color: "#FFFF00",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setScrollFactor(0); // This makes the text stick to the camera

    this.add
      .text(
        16,
        this.cameras.main.height - 40,
        "Use ARROW KEYS or WASD to move and jump. Collect all SOL tokens!",
        {
          fontSize: "16px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 2,
        }
      )
      .setScrollFactor(0); // This makes the text stick to the camera
  }

  setupPhysics() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      undefined,
      this
    );
  }

  update() {
    if (this.levelComplete || this.isShowingQuiz) return;
    // Draw debug bodies each frame so the overlay updates while playing
    try {
      const worldAny = this.physics.world as any;
      if (worldAny.debugGraphic) {
        worldAny.debugGraphic.clear();
        worldAny.drawDebug = true;
        worldAny.drawDebugBodies = true;
      }
    } catch (err) {
      // ignore if debug not available
    }
    const wasd = (this as any).wasd;

    if (this.cursors.left.isDown || wasd.A.isDown) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(true);
      this.player.anims.play("run", true);
    } else if (this.cursors.right.isDown || wasd.D.isDown) {
      this.player.setVelocityX(160);
      this.player.setFlipX(false);
      this.player.anims.play("run", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    if (
      (this.cursors.up.isDown || wasd.W.isDown) &&
      this.player.body &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-350);
      this.player.anims.play("jump", true);
    }

    if (
      this.player.body &&
      !this.player.body.touching.down &&
      this.player.body.velocity.y > 0
    ) {
      this.player.anims.play("fall", true);
    }
  }

  collectCoin: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    coinGO
  ) => {
    const coin = coinGO as Phaser.Physics.Arcade.Sprite;
    coin.destroy();
    this.score += 10;
    this.scoreText.setText(`SOL: ${this.score}`);

    this.cameras.main.flash(100, 255, 215, 0);

    if (this.coins.countActive(true) === 0) {
      this.add
        .text(400, 120, "All SOL collected! Head to the GREEN goal!", {
          fontSize: "20px",
          color: "#FFD700",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
    }
  };

  reachGoal() {
    if (this.coins.countActive(true) > 0) {
      const warning = this.add
        .text(400, 120, "Collect all SOL tokens first!", {
          fontSize: "22px",
          color: "#FF0000",
          stroke: "#FFFFFF",
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      this.time.delayedCall(2000, () => warning.destroy());
      return;
    }

    this.levelComplete = true;
    this.physics.pause();
    this.player.setTint(0x00ff00);

    // Show quiz after each level completion
    this.time.delayedCall(1000, () => {
      this.startQuiz();
    });
  }

  startQuiz() {
    this.isShowingQuiz = true;
    this.showQuestion();
  }

  showQuestion() {
    if (this.questionUI) {
      this.questionUI.destroy();
    }

    const question = SOLANA_QUESTIONS[this.quizIndex];

    // Create overlay first
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    overlay.setDepth(1000); // Ensure it's on top

    // Create container
    this.questionUI = this.add.container(400, 300);
    this.questionUI.setDepth(1001); // Higher than overlay

    // Question background
    const questionBg = this.add.image(0, 0, "uiPanel").setDisplaySize(700, 400);

    // Question title
    const questionTitle = this.add
      .text(0, -160, `Level ${this.currentLevel} Quiz`, {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Question text
    const questionText = this.add
      .text(0, -120, question.question, {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    // Add all elements to container first
    if (this.questionUI) {
      this.questionUI.add([questionBg, questionTitle, questionText]);
    }

    // Answer buttons
    const buttonColors = [0x3498db, 0xe74c3c, 0x2ecc71, 0xf39c12];

    question.answers.forEach((answer, index) => {
      const button = this.add.rectangle(
        0,
        -20 + index * 60,
        500,
        45,
        buttonColors[index]
      );
      button.setStrokeStyle(2, 0xffffff);
      button.setInteractive();

      const answerText = this.add
        .text(
          0,
          -20 + index * 60,
          `${String.fromCharCode(65 + index)}. ${answer}`,
          {
            fontSize: "18px",
            color: "#ffffff",
            align: "center",
          }
        )
        .setOrigin(0.5);

      button.on("pointerover", () => {
        button.setFillStyle(buttonColors[index], 0.8);
      });

      button.on("pointerout", () => {
        button.setFillStyle(buttonColors[index], 1);
      });

      button.on("pointerdown", () => {
        this.handleQuizAnswer(index === question.correct);
      });

      // Add buttons to container
      if (this.questionUI) {
        this.questionUI.add([button, answerText]);
      }
    });

    // Make sure overlay is behind the container
    overlay.setDepth(1000);
    this.questionUI.setDepth(1001);
  }
  handleQuizAnswer(isCorrect: boolean) {
    if (isCorrect) {
      this.score += 20; // Bonus for correct answer
      this.continueGame();
    } else {
      this.score = Math.max(0, this.score - 10);
      this.showIncorrectAnswer();
    }
  }

  showIncorrectAnswer() {
    if (this.questionUI) {
      this.questionUI.destroy();
    }

    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

    this.questionUI = this.add.container(400, 300);

    const incorrectBg = this.add.rectangle(0, 0, 500, 200, 0xe74c3c);
    incorrectBg.setStrokeStyle(4, 0xffffff);

    const incorrectText = this.add
      .text(0, -30, "Wrong Answer!\n-10 SOL", {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    const retryButton = this.add.rectangle(0, 50, 200, 50, 0x3498db);
    retryButton.setStrokeStyle(2, 0xffffff);
    retryButton.setInteractive();

    const retryText = this.add
      .text(0, 50, "Try Again", {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    retryButton.on("pointerdown", () => {
      this.showQuestion();
    });

    if (this.questionUI) {
      this.questionUI.add([
        overlay,
        incorrectBg,
        incorrectText,
        retryButton,
        retryText,
      ]);
    }
  }

  continueGame() {
    this.isShowingQuiz = false;

    if (this.questionUI) {
      this.questionUI.destroy();
    }

    if (this.currentLevel < this.maxLevels) {
      this.scene.start("GameScene", {
        level: this.currentLevel + 1,
        totalScore: this.score,
      });
    } else {
      this.showGameComplete();
    }
  }

  showGameComplete() {
    if (this.questionUI) {
      this.questionUI.destroy();
    }

    this.add
      .text(
        400,
        300,
        `🎉 CONGRATULATIONS! 🎉\n\nYou've mastered Solana!\n\nFinal Score: ${this.score} SOL\n\nYou're now ready to explore\nthe Solana ecosystem!`,
        {
          fontSize: "24px",
          color: "#FFD700",
          align: "center",
          stroke: "#000000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5);

    const restartButton = this.add
      .text(400, 450, "Play Again", {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#2ecc71",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("GameScene", { level: 1, totalScore: 0 });
    });

    // Emit completion event for external (React) listener once
    // Guard to prevent duplicate emissions if method somehow re-entered
    if (!(this as any)._emittedGameComplete) {
      (this as any)._emittedGameComplete = true;
      this.game.events.emit(GAME_COMPLETE_EVENT, {
        finalScore: this.score,
        levels: this.maxLevels,
      });
    }
  }
}
