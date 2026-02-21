// Animated Starfield Background for DotRockets
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        pointerEvents: 'none'
    });
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], shootingStars = [];
    let mouseX = 0, mouseY = 0, scrollY = 0;
    
    const config = {
        starCount: 200,
        starBaseSize: 0.3,
        starMaxSize: 1.5,
        parallaxStrength: 0.015,
        twinkleSpeed: 0.015,
        shootingStarChance: 0.003,
        colors: ['#ffffff', '#ffe9c4', '#d4fbff', '#a8c5ff']
    };
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }
    
    class Star {
        constructor() {
            this.twinkleOffset = Math.random() * Math.PI * 2;
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random();
            this.size = config.starBaseSize + Math.random() * (config.starMaxSize - config.starBaseSize);
            this.baseAlpha = 0.2 + Math.random() * 0.6;
            this.alpha = this.baseAlpha;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
        
        update(time) {
            const twinkle = Math.sin(time * config.twinkleSpeed + this.twinkleOffset);
            this.alpha = Math.max(0.1, Math.min(1, this.baseAlpha + twinkle * 0.2));
            
            const parallaxX = (mouseX - width / 2) * config.parallaxStrength * this.z;
            const parallaxY = (mouseY - height / 2) * config.parallaxStrength * this.z + scrollY * config.parallaxStrength * this.z;
            
            this.displayX = ((this.x - parallaxX) % width + width) % width;
            this.displayY = ((this.y - parallaxY) % height + height) % height;
        }
        
        draw() {
            ctx.beginPath();
            const size = this.size * (0.5 + this.z * 0.5);
            ctx.arc(this.displayX, this.displayY, size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            
            if (this.size > 1) {
                ctx.beginPath();
                ctx.arc(this.displayX, this.displayY, size * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    this.displayX, this.displayY, 0,
                    this.displayX, this.displayY, size * 2
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.globalAlpha = this.alpha * 0.2;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }
    
    class ShootingStar {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.4;
            this.speed = 12 + Math.random() * 8;
            this.angle = Math.PI / 4 + Math.random() * 0.3;
            this.opacity = 1;
            this.alive = true;
            this.trail = [];
        }
        
        update() {
            if (!this.alive) return;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.015;
            this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
            if (this.trail.length > 15) this.trail.shift();
            if (this.opacity <= 0 || this.x > width + 100 || this.y > height + 100) this.alive = false;
        }
        
        draw() {
            if (!this.alive || this.trail.length < 2) return;
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < this.trail.length - 1; i++) {
                const point = this.trail[i];
                const next = this.trail[i + 1];
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(next.x, next.y);
                const alpha = point.opacity * (i / this.trail.length);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.stroke();
            }
            
            const head = this.trail[this.trail.length - 1];
            ctx.beginPath();
            ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            ctx.restore();
        }
    }
    
    function drawNebula() {
        const g1 = ctx.createRadialGradient(width * 0.3, height * 0.2, 0, width * 0.3, height * 0.2, width * 0.6);
        g1.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);
        
        const g2 = ctx.createRadialGradient(width * 0.7, height * 0.8, 0, width * 0.7, height * 0.8, width * 0.5);
        g2.addColorStop(0, 'rgba(139, 92, 246, 0.03)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
    }
    
    let time = 0;
    function animate() {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);
        drawNebula();
        
        stars.forEach(star => {
            star.update(time);
            star.draw();
        });
        
        if (Math.random() < config.shootingStarChance) {
            shootingStars.push(new ShootingStar());
        }
        
        shootingStars = shootingStars.filter(star => {
            star.update();
            star.draw();
            return star.alive;
        });
        
        time++;
        requestAnimationFrame(animate);
    }
    
    function initStars() {
        stars = [];
        for (let i = 0; i < config.starCount; i++) {
            stars.push(new Star());
        }
    }
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });
    
    resize();
    animate();
    console.log('%c🚀 DotRockets Starfield Activated', 'color: #f97316; font-size: 14px; font-weight: bold;');
})();