# 💧 Hindari Air Keras - Water Dodge Game

Game arcade action yang seru untuk menghindari percikan air dari musuh yang mengejar!

## 🎮 Gameplay

- **Tujuan**: Hindari percikan air 💦 yang ditembakkan oleh musuh merah
- **Kontrol**: Gunakan mouse atau touch untuk bergerak
- **Skor**: Semakin lama hidup, semakin tinggi skor
- **Level**: Level naik setiap 500 poin, musuh semakin banyak dan cepat

## 📱 Fitur

✨ **Gameplay Menarik**
- Dodging mechanics yang smooth
- AI musuh yang cerdas mengejar dan menembak
- Progressive difficulty system

📊 **Sistem Scoring**
- Real-time score display
- Level progression
- Multiple enemies di level tinggi

⚙️ **Technical Features**
- Collision detection yang akurat
- Smooth animation dengan requestAnimationFrame
- Responsive design untuk mobile & desktop
- Canvas-based 2D rendering

## 🎮 Cara Bermain

1. Buka `index.html` di browser
2. Klik tombol "Mulai Bermain"
3. Gunakan mouse/touch untuk bergerak
4. Hindari percikan air dari musuh
5. Tekan Space untuk pause
6. Semakin tinggi level, semakin sulit permainan

## 📁 Struktur Project

```
game/
├── index.html        # Main HTML file
├── css/
│   └── style.css     # Styling & animations
├── js/
│   └── game.js       # Game logic & classes
└── README.md         # Dokumentasi
```

## 🛠️ Classes

### Player
- `update()` - Update posisi player mengikuti mouse
- `draw()` - Render player dengan glow effect
- `collidesWith()` - Check collision dengan water

### Water
- Proyektil yang ditembak musuh
- Memiliki lifespan 300 frame
- Fade out effect seiring waktu

### Enemy
- Mengejar posisi player
- Menembak water dengan interval tertentu
- Speed meningkat seiring level

### Game
- Main game controller
- Mengelola update & render
- Handle input & collision
- Level progression

## 🎨 Design

- Color scheme: Purple gradient + Cyan accents
- Modern UI dengan smooth animations
- Responsive untuk semua ukuran layar
- Glow effects untuk visual yang menarik

## 📈 Difficulty Progression

| Level | Musuh | Speed | Shoot Rate |
|-------|-------|-------|-----------|
| 1     | 1     | 1.5x  | Normal    |
| 2     | 2     | 1.8x  | Normal    |
| 3     | 3     | 2.1x  | Cepat     |
| 4+    | Banyak| 2.4x+ | Sangat Cepat |

## 🚀 Cara Mengembangkan

### Tambah Fitur Baru
1. Edit `js/game.js` untuk logic
2. Edit `css/style.css` untuk styling
3. Update `index.html` untuk UI

### Contoh: Tambah Power-up
```javascript
class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // ...
    }
}
```

## 📝 TODO / Future Features

- [ ] Sound effects
- [ ] Background music
- [ ] High score leaderboard
- [ ] Different player skins
- [ ] Power-ups (shield, speed boost)
- [ ] Different enemy types
- [ ] Particle effects
- [ ] Achievements/badges

## 🐛 Known Issues

Tidak ada issue yang diketahui saat ini. Laporkan bug di GitHub Issues!

## 📄 License

MIT License - Feel free to use & modify

## 👨‍💻 Author

**sinugrahapamungkas-lang**

Selamat bermain! 🎉
