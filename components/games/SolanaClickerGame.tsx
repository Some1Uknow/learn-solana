"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";

interface Question {
  question: string;
  answers: string[];
  correct: number;
}

const SOLANA_QUESTIONS: Question[] = [
  {
    question: "What is Solana's native cryptocurrency called?",
    answers: ["ETH", "SOL", "BTC", "ADA"],
    correct: 1,
  },
  {
    question: "What makes Solana fast?",
    answers: ["Proof of Work", "Proof of History", "Mining", "Staking only"],
    correct: 1,
  },
  {
    question: "Solana can process how many transactions per second?",
    answers: ["15 TPS", "100 TPS", "65,000+ TPS", "1,000 TPS"],
    correct: 2,
  },
  {
    question:
      "What programming language is commonly used for Solana smart contracts?",
    answers: ["JavaScript", "Python", "Rust", "Java"],
    correct: 2,
  },
  {
    question: "What is an SPL token on Solana?",
    answers: ["A bug", "Solana's token standard", "A wallet", "A validator"],
    correct: 1,
  },
];

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private stars!: Phaser.Physics.Arcade.Group;
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
    // Create proper colored rectangles using Phaser's built-in graphics
    this.load.image(
      "sky",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    );
    // Load your uploaded sprite sheet
    this.load.spritesheet(
      "playerSheet",
      "/game-assets/solana-clicker/sprite-sheet-1.png",
      {
        frameWidth: 216,
        frameHeight: 296,
      }
    );
    // Create graphics textures instead of loading images
    this.createTextures();
  }

  createTextures() {
    // Create ground texture
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x8b4513);
    groundGraphics.fillRect(0, 0, 32, 32);
    groundGraphics.generateTexture("ground", 32, 32);
    groundGraphics.destroy();

    // Create player texture
    // const playerGraphics = this.add.graphics();
    // playerGraphics.fillStyle(0xff0000);
    // playerGraphics.fillRect(0, 0, 32, 48);
    // playerGraphics.generateTexture("player", 32, 48);
    // playerGraphics.destroy();

    // Create star texture
    const starGraphics = this.add.graphics();
    starGraphics.fillStyle(0xffd700);
    starGraphics.fillCircle(16, 16, 16);
    starGraphics.generateTexture("star", 32, 32);
    starGraphics.destroy();
  }

  create() {
    // Sky background with different colors per level
    const skyColors = [0x87ceeb, 0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4];
    // ✅ Updated to use this.cameras.main.width and height for correct positioning
    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      skyColors[this.currentLevel - 1] || 0x87ceeb
    );

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
  }
  createPlayer() {
    // ✅ Use the sprite sheet as texture, not the red debug rectangle
    this.player = this.physics.add.sprite(80, 450, "playerSheet", 0);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.player.setScale(0.3);
    this.player.body!.setSize(this.player.width, this.player.height);
    this.player.body!.setOffset(0, 0);

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
    // Ground
    this.platforms.create(400, 580, "ground").setScale(25, 1.25).refreshBody();

    // Platforms
    this.platforms
      .create(200, 480, "ground")
      .setScale(5.5, 0.625)
      .refreshBody();
    this.platforms
      .create(600, 380, "ground")
      .setScale(5.5, 0.625)
      .refreshBody();
    this.platforms
      .create(700, 280, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();

    this.createGoal(700, 250);
  }

  createLevel2() {
    this.platforms.create(400, 580, "ground").setScale(25, 1.25).refreshBody();
    this.platforms
      .create(150, 500, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(350, 420, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(550, 340, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(700, 260, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();

    this.createGoal(700, 230);
  }

  createLevel3() {
    this.platforms.create(400, 580, "ground").setScale(25, 1.25).refreshBody();
    this.platforms
      .create(120, 480, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(400, 400, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(180, 320, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(500, 240, "ground")
      .setScale(4.5, 0.625)
      .refreshBody();
    this.platforms
      .create(700, 180, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();

    this.createGoal(700, 150);
  }

  createLevel4() {
    this.platforms.create(400, 580, "ground").setScale(25, 1.25).refreshBody();
    this.platforms
      .create(150, 480, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();
    this.platforms
      .create(650, 480, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();
    this.platforms.create(400, 380, "ground").setScale(5, 0.625).refreshBody();
    this.platforms
      .create(120, 280, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();
    this.platforms
      .create(680, 280, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();
    this.platforms
      .create(400, 180, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();

    this.createGoal(400, 150);
  }

  createLevel5() {
    this.platforms.create(400, 580, "ground").setScale(25, 1.25).refreshBody();
    this.platforms.create(120, 500, "ground").setScale(3, 0.625).refreshBody();
    this.platforms.create(320, 440, "ground").setScale(3, 0.625).refreshBody();
    this.platforms.create(520, 380, "ground").setScale(3, 0.625).refreshBody();
    this.platforms.create(680, 320, "ground").setScale(3, 0.625).refreshBody();
    this.platforms.create(480, 260, "ground").setScale(3, 0.625).refreshBody();
    this.platforms.create(280, 200, "ground").setScale(3, 0.625).refreshBody();
    this.platforms
      .create(480, 140, "ground")
      .setScale(3.75, 0.625)
      .refreshBody();

    this.createGoal(480, 110);
  }

  createGoal(x: number, y: number) {
    const goal = this.add.rectangle(x, y, 60, 60, 0x00ff00);
    goal.setStrokeStyle(4, 0xffffff);

    this.tweens.add({
      targets: goal,
      scaleX: 1.1,
      scaleY: 1.1,
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
    const starPositions = this.getStarPositions();
    this.stars = this.physics.add.group();

    starPositions.forEach((pos) => {
      const star = this.stars.create(pos.x, pos.y, "star");
      star.setBounceY(0.3);
      star.body.setSize(28, 28);

      this.tweens.add({
        targets: star,
        rotation: Math.PI * 2,
        duration: 2000,
        repeat: -1,
        ease: "Linear",
      });
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
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    );
  }

  update() {
    if (this.levelComplete || this.isShowingQuiz) return;
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
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-350);
      this.player.anims.play("jump", true);
    }

    if (!this.player.body.touching.down && this.player.body.velocity.y > 0) {
      this.player.anims.play("fall", true);
    }
  }

  collectStar(
    player: Phaser.GameObjects.GameObject,
    star: Phaser.GameObjects.GameObject
  ) {
    (star as Phaser.Physics.Arcade.Sprite).destroy();
    this.score += 10;
    this.scoreText.setText(`SOL: ${this.score}`);

    this.cameras.main.flash(100, 255, 215, 0);

    if (this.stars.countActive(true) === 0) {
      this.add
        .text(400, 120, "All SOL collected! Head to the GREEN goal!", {
          fontSize: "20px",
          color: "#FFD700",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
    }
  }

  reachGoal() {
    if (this.stars.countActive(true) > 0) {
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
    const questionBg = this.add.rectangle(0, 0, 700, 400, 0x2c3e50);
    questionBg.setStrokeStyle(4, 0xffffff);

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
    this.questionUI.add([questionBg, questionTitle, questionText]);

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
      this.questionUI.add([button, answerText]);
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

    this.questionUI.add([
      overlay,
      incorrectBg,
      incorrectText,
      retryButton,
      retryText,
    ]);
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
  }
}

interface SolanaClickerGameProps {
  onGameComplete?: () => void;
}

export default function SolanaClickerGame({
  onGameComplete,
}: SolanaClickerGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current || typeof window === "undefined") return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      // ✅ Set fixed game dimensions
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: true,
        },
      },
      scene: GameScene,
      backgroundColor: "#34495e",
      // ✅ Add the scale manager configuration
      scale: {
        mode: Phaser.Scale.FIT, // This mode automatically scales the canvas to fit the parent
        autoCenter: Phaser.Scale.CENTER_BOTH, // This centers the game canvas
        parent: gameRef.current,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    // Ensure canvas can receive focus for keyboard input
    if (phaserGameRef.current.canvas) {
      phaserGameRef.current.canvas.tabIndex = 0;
      phaserGameRef.current.canvas.focus();
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const handleClick = () => {
    if (phaserGameRef.current && phaserGameRef.current.canvas) {
      phaserGameRef.current.canvas.focus();
    }
  };

  if (typeof window === "undefined") {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-200 rounded-lg">
        <p>Loading Solana Clicker Game...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      onClick={handleClick}
      tabIndex={0}
    >
      <div
        ref={gameRef}
        className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg"
      />
    </div>
  );
}
