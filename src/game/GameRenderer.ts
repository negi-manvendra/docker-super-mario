import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Platform } from './entities/Platform';

export class GameRenderer {
    public clear(ctx: CanvasRenderingContext2D, width: number, height: number, cameraX: number): void {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4facfe'); // Deeper blue
        gradient.addColorStop(1, '#00f2fe'); // Lighter blue
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some parallax-style mountains in background
        this.drawMountains(ctx, width, height, cameraX);
        
        // Add some clouds
        this.drawClouds(ctx, width, height, cameraX);
    }

    private drawMountains(ctx: CanvasRenderingContext2D, width: number, height: number, cameraX: number): void {
        const parallaxFactor = 0.2;
        const offset = -(cameraX * parallaxFactor) % 400;
        
        ctx.fillStyle = 'rgba(34, 139, 34, 0.3)'; // Faded green for distant hills
        
        for (let i = -1; i < (width / 400) + 1; i++) {
            const x = i * 400 + offset;
            ctx.beginPath();
            ctx.moveTo(x, height);
            ctx.lineTo(x + 200, height - 150);
            ctx.lineTo(x + 400, height);
            ctx.fill();
        }
    }

    private drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number, cameraX: number): void {
        const parallaxFactor = 0.5;
        const offset = -(cameraX * parallaxFactor);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        
        const clouds = [
            { x: 150, y: 80, size: 40 },
            { x: 400, y: 60, size: 50 },
            { x: 700, y: 90, size: 35 },
            { x: 900, y: 70, size: 45 }
        ];

        clouds.forEach((cloud, index) => {
            const x = ((cloud.x + offset + index * 500) % (width + 400)) - 200;
            ctx.beginPath();
            ctx.arc(x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.arc(x + 25, cloud.y - 10, cloud.size * 0.8, 0, Math.PI * 2);
            ctx.arc(x + 50, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    public renderPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
        // Draw shadow
        if (player.isGrounded) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(player.x + player.width / 2, player.y + player.height - 2, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.save();
        
        // Flip sprite if moving left
        if (player.direction === 'left') {
            ctx.scale(-1, 1);
            ctx.translate(-player.x - player.width, 0);
        }

        // Mario colors - More vibrant
        const colors = {
            hat: '#e63946',
            skin: '#ffb703',
            shirt: '#e63946',
            overalls: '#1d3557',
            shoes: '#457b9d'
        };

        this.drawMarioSprite(ctx, player.x, player.y, colors, player.animationFrame, player);
        
        ctx.restore();
    }

    private drawMarioSprite(ctx: CanvasRenderingContext2D, x: number, y: number, colors: any, frame: number, player: Player): void {
        const pixelSize = 2;
        
        // Hat
        ctx.fillStyle = colors.hat;
        ctx.fillRect(x + 8 * pixelSize, y + 2 * pixelSize, 16 * pixelSize, 6 * pixelSize);
        
        // Face
        ctx.fillStyle = colors.skin;
        ctx.fillRect(x + 6 * pixelSize, y + 8 * pixelSize, 20 * pixelSize, 8 * pixelSize);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 10 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 3 * pixelSize);
        ctx.fillRect(x + 20 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 3 * pixelSize);
        
        // Shirt
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(x + 4 * pixelSize, y + 16 * pixelSize, 24 * pixelSize, 8 * pixelSize);
        
        // Overalls
        ctx.fillStyle = colors.overalls;
        ctx.fillRect(x + 6 * pixelSize, y + 20 * pixelSize, 20 * pixelSize, 8 * pixelSize);
        
        // Legs (animated with better logic)
        const isMoving = Math.abs(player.velocityX) > 10;
        const legOffset = isMoving ? (frame % 2) * 3 : 0;
        const jumpOffset = player.isJumping ? -4 : 0;

        ctx.fillRect(x + (8 + legOffset) * pixelSize, y + (24 + jumpOffset) * pixelSize, 6 * pixelSize, 8 * pixelSize);
        ctx.fillRect(x + (18 - legOffset) * pixelSize, y + (24 + jumpOffset) * pixelSize, 6 * pixelSize, 8 * pixelSize);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(x + (6 + legOffset) * pixelSize, y + (28 + jumpOffset) * pixelSize, 10 * pixelSize, 4 * pixelSize);
        ctx.fillRect(x + (16 - legOffset) * pixelSize, y + (28 + jumpOffset) * pixelSize, 10 * pixelSize, 4 * pixelSize);
    }

    public renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
        if (enemy.type === 'goomba') {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height - 2, 10, 3, 0, 0, Math.PI * 2);
            ctx.fill();

            this.drawGoomba(ctx, enemy.x, enemy.y, enemy.animationFrame);
        }
    }

    private drawGoomba(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
        const pixelSize = 2;
        
        // Body
        ctx.fillStyle = '#bc6c25';
        ctx.fillRect(x + 2 * pixelSize, y + 4 * pixelSize, 24 * pixelSize, 16 * pixelSize);
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 6 * pixelSize, y + 8 * pixelSize, 4 * pixelSize, 4 * pixelSize);
        ctx.fillRect(x + 18 * pixelSize, y + 8 * pixelSize, 4 * pixelSize, 4 * pixelSize);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 8 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 2 * pixelSize);
        ctx.fillRect(x + 20 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 2 * pixelSize);
        
        // Feet
        const footOffset = frame % 2;
        ctx.fillStyle = '#283618';
        ctx.fillRect(x + (4 + footOffset) * pixelSize, y + 20 * pixelSize, 8 * pixelSize, 4 * pixelSize);
        ctx.fillRect(x + (16 - footOffset) * pixelSize, y + 20 * pixelSize, 8 * pixelSize, 4 * pixelSize);
    }

    public renderCoin(ctx: CanvasRenderingContext2D, coin: Coin): void {
        if (coin.collected) return;

        const centerX = coin.x + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        
        const rotation = (Date.now() * 0.008) % (Math.PI * 2);
        const scale = Math.abs(Math.cos(rotation));
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, 1);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, 12);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
    }

    public renderPlatform(ctx: CanvasRenderingContext2D, platform: Platform): void {
        if (platform.type === 'ground') {
            // Ground
            ctx.fillStyle = '#386641';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Grass top
            ctx.fillStyle = '#6a994e';
            ctx.fillRect(platform.x, platform.y, platform.width, 10);
            
            // Decorative highlights
            ctx.fillStyle = '#a7c957';
            for (let i = 0; i < platform.width; i += 40) {
                ctx.fillRect(platform.x + i, platform.y, 10, 4);
            }
        } else {
            // Floating platform with texture
            ctx.fillStyle = '#bc6c25';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            ctx.strokeStyle = '#283618';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            
            // Texture lines
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            for(let i = 8; i < platform.width; i += 16) {
                ctx.moveTo(platform.x + i, platform.y + 4);
                ctx.lineTo(platform.x + i, platform.y + platform.height - 4);
            }
            ctx.stroke();
        }
    }
}