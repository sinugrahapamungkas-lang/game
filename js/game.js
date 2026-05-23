// Game Configuration
const GAME_CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    PLAYER_SIZE: 20,
    WATER_SIZE: 8,
    ENEMY_SIZE: 25,
    ENEMY_SPEED: 1.5,
    SHOOT_INTERVAL: 60,
};

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = GAME_CONFIG.PLAYER_SIZE;
        this.speed = 6;
        this.targetX = x;
        this.targetY = y;
    }

    update(mouseX, mouseY) {
        // Smooth movement toward mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        // Keep in bounds
        this.x = Math.max(this.size, Math.min(GAME_CONFIG.WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(GAME_CONFIG.HEIGHT - this.size, this.y));
    }

    draw(ctx) {
        // Player body with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00d4ff';
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    collidesWith(water) {
        const dx = this.x - water.x;
        const dy = this.y - water.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.size + water.size;
    }
}

// Water Projectile Class
class Water {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.size = GAME_CONFIG.WATER_SIZE;
        this.lifespan = 300;
        this.maxLifespan = 300;

        // Direction toward target
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / distance) * 3;
        this.vy = (dy / distance) * 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifespan--;
    }

    draw(ctx) {
        const opacity = this.lifespan / this.maxLifespan;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(100, 200, 255, ${opacity})`;
        ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    isAlive() {
        return this.lifespan > 0 &&
            this.x > 0 &&
            this.x < GAME_CONFIG.WIDTH &&
            this.y > 0 &&
            this.y < GAME_CONFIG.HEIGHT;
    }
}

// Enemy Class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = GAME_CONFIG.ENEMY_SIZE;
        this.shootCounter = 0;
        this.shootInterval = GAME_CONFIG.SHOOT_INTERVAL;
    }

    update(playerX, playerY, level) {
        // Chase player with increasing speed based on level
        const speed = GAME_CONFIG.ENEMY_SPEED + (level - 1) * 0.3;
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        }

        // Keep in bounds
        this.x = Math.max(this.size, Math.min(GAME_CONFIG.WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(GAME_CONFIG.HEIGHT - this.size, this.y));

        // Update shoot counter
        this.shootCounter++;
        if (this.shootCounter >= this.shootInterval) {
            this.shootCounter = 0;
            this.shootInterval = Math.max(30, GAME_CONFIG.SHOOT_INTERVAL - level * 5);
        }
    }

    draw(ctx) {
        // Enemy body with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff4444';
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    shouldShoot() {
        return this.shootCounter === 0;
    }
}

// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = null;
        this.enemies = [];
        this.waterProjectiles = [];
        this.score = 0;
        this.level = 1;
        this.gameActive = false;
        this.isPaused = false;
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;

        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => this.start());

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => this.start());

        // Resume button
        document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());

        // Menu button
        document.getElementById('menuBtn').addEventListener('click', () => this.gameOver());

        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Touch movement
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        });

        // Pause on space
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameActive) {
                e.preventDefault();
                this.togglePause();
            }
        });
    }

    start() {
        this.gameActive = true;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.enemies = [new Enemy(100, 100)];
        this.waterProjectiles = [];

        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseScreen = document.getElementById('pauseScreen');
        if (this.isPaused) {
            pauseScreen.classList.remove('hidden');
        } else {
            pauseScreen.classList.add('hidden');
        }
    }

    gameOver() {
        this.gameActive = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
    }

    update() {
        if (!this.gameActive || this.isPaused) return;

        // Update player
        this.player.update(this.mouseX, this.mouseY);

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(this.player.x, this.player.y, this.level);

            // Check if enemy should shoot
            if (enemy.shouldShoot()) {
                this.waterProjectiles.push(
                    new Water(enemy.x, enemy.y, this.player.x, this.player.y)
                );
            }
        });

        // Update water projectiles
        this.waterProjectiles = this.waterProjectiles.filter(water => water.isAlive());
        this.waterProjectiles.forEach(water => water.update());

        // Check collisions
        this.waterProjectiles.forEach(water => {
            if (this.player.collidesWith(water)) {
                this.gameOver();
            }
        });

        // Increase score
        this.score++;

        // Level progression
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel !== this.level) {
            this.level = newLevel;
            // Add new enemy
            if (this.enemies.length < this.level) {
                const randomX = Math.random() * this.canvas.width;
                const randomY = Math.random() * this.canvas.height;
                this.enemies.push(new Enemy(randomX, randomY));
            }
        }

        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(15, 52, 96, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));

        // Draw water projectiles
        this.waterProjectiles.forEach(water => water.draw(this.ctx));

        // Draw player
        if (this.player) {
            this.player.draw(this.ctx);
        }

        // Draw pause indicator
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
