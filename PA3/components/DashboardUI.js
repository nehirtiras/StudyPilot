class DashboardUI {
    static async renderUnified() {
        const container = document.getElementById("dashboard");

        const weather = await WeatherService.getWeather();
        const playlists = await SpotifyService.getPlaylist();
        const userPlaylists = await SpotifyService.getUserPlaylists();
        const recommendations = await SpotifyService.getRecommendations();
        const tasks = Prioritizer.sortTasks(TaskManager.load());

        container.innerHTML = `
            <h1 class="dashboard-title">StudyPilot</h1>
            
            <div class="dashboard-grid">

                <!-- LEFT TOP: WEATHER -->
                <div class="glass-card grid-left-top">
                    <h2>Weather</h2>

                    <div class="weather-row">
                        <span class="weather-icon">${weather.icon}</span>
                        <div>
                            <p class="metric">${weather.temp}°C</p>
                            <p style="opacity:0.8;">${weather.condition}</p>
                        </div>
                    </div>
                    
                    <!-- ✨ Study suggestion -->
                    <p class="weather-suggestion">
                        ${weather.suggestion}
                    </p>
                </div>

                <!-- LEFT MIDDLE: SPOTIFY -->
                <div class="glass-card grid-left-middle" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                    ${(playlists && playlists.length > 0) || (recommendations && recommendations.length > 0) ? `
                        <!-- Tab Headers -->
                        <div style="display: flex; background: rgba(0,0,0,0.2); padding: 8px 12px; gap: 8px;">
                            <button 
                                id="tabRecommendations" 
                                onclick="DashboardUI.switchSpotifyTab('recommendations')"
                                style="flex: 1; padding: 8px 12px; background: #1DB954; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                                ⚡ Recommendations
                            </button>
                            <button 
                                id="tabPlaylists" 
                                onclick="DashboardUI.switchSpotifyTab('playlists')"
                                style="flex: 1; padding: 8px 12px; background: rgba(255,255,255,0.1); color: #ccc; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                                🎵 Playlists
                            </button>
                        </div>

                        <!-- Tab Content: Recommendations -->
                        <div id="spotifyRecommendations" style="flex: 1; overflow: hidden; position: relative;">
                            ${recommendations && recommendations.length > 0 ? `
                                <!-- Playlist List View -->
                                <div id="recListView" style="padding: 15px; height: 100%; overflow-y: auto;">
                                    <h3 style="margin: 0 0 12px 0; font-size: 0.95em; opacity: 0.8;">Focus Music for You</h3>
                                    ${recommendations.map(track => `
                                        <div class="track-item" onclick="DashboardUI.showRecPlayer('${track.id}')" style="display: flex; align-items: center; padding: 8px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                                            <img src="${track.image}" alt="${track.name}" style="width: 45px; height: 45px; border-radius: 4px; margin-right: 10px;">
                                            <div style="flex: 1; min-width: 0;">
                                                <p style="margin: 0; font-weight: 600; font-size: 0.9em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${track.name}</p>
                                                <p style="margin: 0; font-size: 0.8em; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${track.artist}</p>
                                            </div>
                                            <div style="background: #1DB954; color: white; padding: 5px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600; white-space: nowrap;">▶ Play</div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <!-- Embed Player View (Hidden by default) -->
                                <div id="recPlayerView" style="display: none; height: 100%; flex-direction: column;">
                                    <button onclick="DashboardUI.hideRecPlayer()" style="margin: 10px; padding: 8px 16px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; align-self: flex-start;">
                                        ← Back
                                    </button>
                                    <iframe id="recPlayerIframe" width="100%" style="flex: 1; min-height: 380px;" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                </div>
                            ` : `
                                <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                                    <p style="opacity: 0.6;">No recommendations available</p>
                                </div>
                            `}
                        </div>

                        <!-- Tab Content: Playlists -->
                        <div id="spotifyPlaylists" style="flex: 1; overflow: hidden; display: none; position: relative;">
                            ${userPlaylists && userPlaylists.length > 0 ? `
                                <!-- User Playlist List View -->
                                <div id="playlistListView" style="padding: 15px; height: 100%; overflow-y: auto;">
                                    <h3 style="margin: 0 0 12px 0; font-size: 0.95em; opacity: 0.8;">Your Playlists</h3>
                                    ${userPlaylists.map(playlist => `
                                        <div class="playlist-item" onclick="DashboardUI.showPlaylistPlayer('${playlist.id}')" style="display: flex; align-items: center; padding: 8px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                                            <img src="${playlist.image}" alt="${playlist.name}" style="width: 45px; height: 45px; border-radius: 4px; margin-right: 10px;">
                                            <div style="flex: 1; min-width: 0;">
                                                <p style="margin: 0; font-weight: 600; font-size: 0.9em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${playlist.name}</p>
                                                <p style="margin: 0; font-size: 0.8em; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${playlist.artist}</p>
                                            </div>
                                            <div style="background: #1DB954; color: white; padding: 5px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600; white-space: nowrap;">▶ Play</div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <!-- Playlist Embed Player View (Hidden by default) -->
                                <div id="playlistPlayerView" style="display: none; height: 100%; flex-direction: column;">
                                    <button onclick="DashboardUI.hidePlaylistPlayer()" style="margin: 10px; padding: 8px 16px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; align-self: flex-start;">
                                        ← Back
                                    </button>
                                    <iframe id="playlistPlayerIframe" width="100%" style="flex: 1; min-height: 380px;" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                </div>
                            ` : `
                                <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                                    <p style="opacity: 0.6;">No playlists available</p>
                                </div>
                            `}
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px 20px 40px 20px; text-align: center;">
                            <h2 style="margin-bottom: 10px;">Spotify Focus</h2>
                            <p style="margin-bottom: 15px; font-size: 0.9em; opacity: 0.8;">Odaklanma müzikleri için bağlan.</p>
                            <button onclick="SpotifyService.redirectToAuthCodeFlow()" style="
                                background: #1DB954; 
                                color: white; 
                                border: none; 
                                padding: 10px 20px; 
                                border-radius: 20px; 
                                font-weight: bold; 
                                cursor: pointer;
                                transition: transform 0.2s;
                            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                Spotify'a Bağlan
                            </button>
                        </div>
                    `}
                </div>

                <!-- LEFT BOTTOM: POMODORO -->
                <div class="glass-card pomodoro-card">
                    <h2>Pomodoro</h2>
                    <div id="timer" class="timer-wrapper">25:00</div>

                    <div class="pomodoro-buttons">
                        <button onclick="Pomodoro.start()">Start</button>
                        <button onclick="Pomodoro.pause()">Pause</button>
                        <button onclick="Pomodoro.reset()">Reset</button>
                    </div>

                    <!-- YENİ: Custom session length seçici -->
                    <div class="pomodoro-settings">
                        <span>Focus length:</span>
                        <input 
                            id="pomodoroLengthInput"
                            type="number"
                            min="1"
                            max="180"
                            placeholder="25"
                            oninput="Pomodoro.changeDuration(this.value)"
                            style="width: 70px; text-align: center;"
                        >
                        <span>min</span>
                    </div>
                </div>

                <!-- CENTER: TASKS -->
                <div class="glass-card grid-center">
                    <h2>Tasks</h2>
                    <button onclick="TaskCard.showAddForm()">+ Add Task</button>
                    <div id="taskList" class="task-list"></div>
                </div>

                <!-- RIGHT: ANALYTICS -->
                <div id="analytics" class="glass-card grid-right"></div>

            </div>
        `;

        TaskCard.renderAllInDashboard();
        Analytics.render();

        DashboardUI.updateProgress();
    }

    static updateProgress() {
        const tasks = TaskManager.load();
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;

        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        const fill = document.querySelector(".progress-fill");
        const text = document.querySelector(".progress-text");

        if (fill && text) {
            fill.style.width = percent + "%";
            text.textContent = percent + "%";
        }
    }

    static switchSpotifyTab(tab) {
        const recTab = document.getElementById('tabRecommendations');
        const playTab = document.getElementById('tabPlaylists');
        const recContent = document.getElementById('spotifyRecommendations');
        const playContent = document.getElementById('spotifyPlaylists');

        if (tab === 'recommendations') {
            // Activate recommendations tab
            recTab.style.background = '#1DB954';
            recTab.style.color = 'white';
            playTab.style.background = 'rgba(255,255,255,0.1)';
            playTab.style.color = '#ccc';

            recContent.style.display = 'block';
            playContent.style.display = 'none';
        } else {
            // Activate playlists tab
            playTab.style.background = '#1DB954';
            playTab.style.color = 'white';
            recTab.style.background = 'rgba(255,255,255,0.1)';
            recTab.style.color = '#ccc';

            playContent.style.display = 'block';
            recContent.style.display = 'none';
        }
    }

    static showRecPlayer(playlistId) {
        const listView = document.getElementById('recListView');
        const playerView = document.getElementById('recPlayerView');
        const iframe = document.getElementById('recPlayerIframe');

        // Hide list, show player
        listView.style.display = 'none';
        playerView.style.display = 'flex';

        // Load playlist in iframe with autoplay and full interactive UI
        iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    }

    static hideRecPlayer() {
        const listView = document.getElementById('recListView');
        const playerView = document.getElementById('recPlayerView');
        const iframe = document.getElementById('recPlayerIframe');

        // Show list, hide player
        listView.style.display = 'block';
        playerView.style.display = 'none';

        // Stop music by clearing iframe
        iframe.src = '';
    }

    static showPlaylistPlayer(playlistId) {
        const listView = document.getElementById('playlistListView');
        const playerView = document.getElementById('playlistPlayerView');
        const iframe = document.getElementById('playlistPlayerIframe');

        // Hide list, show player
        listView.style.display = 'none';
        playerView.style.display = 'flex';

        // Load playlist in iframe
        iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    }

    static hidePlaylistPlayer() {
        const listView = document.getElementById('playlistListView');
        const playerView = document.getElementById('playlistPlayerView');
        const iframe = document.getElementById('playlistPlayerIframe');

        // Show list, hide player
        listView.style.display = 'block';
        playerView.style.display = 'none';

        // Stop music by clearing iframe
        iframe.src = '';
    }
}

