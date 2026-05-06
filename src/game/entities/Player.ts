import { InputHandler } from '../InputHandler';
import { Platform } from './Platform';

export class Player {
    public x: number;
    public y: number;
    public width: number = 32;
    public height: number = 32;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public acceleration: number = 1000; // Smoother movement
    public jumpPower: number = 650;
    public isJumping: boolean = false;
    public isGrounded: boolean = false;
    public direction: 'left' | 'right' = 'right';
    public animationFrame: number = 0;
    public animationTimer: number = 0;

    private readonly gravity: number = 1800; // Snappier gravity
    private readonly friction: number = 0.85; // Less slide
    private readonly maxSpeed: number = 350; // Faster top speed

    constructor(
        x: number,
        y: number,
        private inputHandler: InputHandler
    ) {
        this.x = x;
        this.y = y;
    }

    public update(deltaTime: number, platforms: Platform[]): void {
        const dt = deltaTime / 1000; // Convert to seconds

        this.handleInput(dt);
        this.applyPhysics(dt);
        this.handlePlatformCollisions(platforms);
        this.updateAnimation(deltaTime);
    }

    private handleInput(deltaTime: number): void {
        const keys = this.inputHandler.keys;

        // Horizontal movement with acceleration
        if (keys.ArrowLeft) {
            this.velocityX = Math.max(this.velocityX - this.acceleration * deltaTime, -this.maxSpeed);
            this.direction = 'left';
        } else if (keys.ArrowRight) {
            this.velocityX = Math.min(this.velocityX + this.acceleration * deltaTime, this.maxSpeed);
            this.direction = 'right';
        } else {
            // Apply ground/air friction
            this.velocityX *= this.friction;
            if (Math.abs(this.velocityX) < 5) this.velocityX = 0;
        }

        // Jumping
        if (keys.Space && this.isGrounded && !this.isJumping) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
            this.isGrounded = false;
        }

        // Variable jump height: cut velocity if space is released while moving up
        if (!keys.Space && this.velocityY < -200) {
            this.velocityY *= 0.5;
        }
    }

    private applyPhysics(deltaTime: number): void {
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;

        // Cap falling speed
        if (this.velocityY > 800) this.velocityY = 800;

        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Keep player within screen bounds
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
    }

    private handlePlatformCollisions(platforms: Platform[]): void {
        this.isGrounded = false;

        platforms.forEach(platform => {
            if (this.checkCollisionWith(platform)) {
                // Top collision (landing on platform)
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isGrounded = true;
                    this.isJumping = false;
                }
                // Bottom collision (hitting platform from below)
                else if (this.velocityY < 0 && this.y > platform.y) {
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;
                }
                // Side collisions
                else if (this.velocityX > 0 && this.x < platform.x) {
                    this.x = platform.x - this.width;
                    this.velocityX = 0;
                } else if (this.velocityX < 0 && this.x > platform.x) {
                    this.x = platform.x + platform.width;
                    this.velocityX = 0;
                }
            }
        });
    }

    private checkCollisionWith(platform: Platform): boolean {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }

    private updateAnimation(deltaTime: number): void {
        this.animationTimer += deltaTime;
        
        // Speed up animation based on velocity
        const animationSpeed = Math.max(80, 200 - Math.abs(this.velocityX) * 0.4);

        if (this.animationTimer > animationSpeed) { 
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    public bounce(): void {
        this.velocityY = -350; // More satisfying bounce
        this.isJumping = true;
        this.isGrounded = false;
    }

    public reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = false;
        this.direction = 'right';
    }
}