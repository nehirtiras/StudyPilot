class SpotifyService {
    static clientId = "249d10a377594cc381a50d0846456bed";
    static redirectUri = "https://cool-zuccutto-dd7c3c.netlify.app/index.html";
    static authEndpoint = "https://accounts.spotify.com/authorize";
    static tokenEndpoint = "https://accounts.spotify.com/api/token";

    static scopes = [
        "user-read-private",
        "playlist-read-private",
        "user-read-currently-playing"
    ];

    static generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    static async generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static async refreshAccessToken() {
        const refreshToken = localStorage.getItem("spotify_refresh_token");

        if (!refreshToken) {
            console.error("Refresh token bulunamadı!");
            return false;
        }

        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);

        try {
            const result = await fetch(this.tokenEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });

            const data = await result.json();

            if (!result.ok) {
                console.error("Token Refresh Error:", data);
                return false;
            }

            const { access_token, refresh_token, expires_in } = data;

            if (access_token) {
                localStorage.setItem("spotify_access_token", access_token);
                if (refresh_token) {
                    localStorage.setItem("spotify_refresh_token", refresh_token);
                }
                const expiryTime = Date.now() + (expires_in * 1000);
                localStorage.setItem("spotify_token_expiry", expiryTime);
                console.log("Token başarıyla yenilendi!");
                return true;
            }

            return false;
        } catch (error) {
            console.error("Token refresh hatası:", error);
            return false;
        }
    }

    static async checkAndRefreshToken() {
        const token = localStorage.getItem("spotify_access_token");
        const expiry = localStorage.getItem("spotify_token_expiry");

        if (!token) {
            return false;
        }

        // Token süresi dolmuş veya 5 dakikadan az kalmışsa yenile
        const fiveMinutes = 5 * 60 * 1000;
        if (expiry && Date.now() + fiveMinutes > parseInt(expiry)) {
            console.log("Token süresi dolmak üzere, yenileniyor...");
            return await this.refreshAccessToken();
        }

        return true; // Token hala geçerli
    }

    static async getPlaylist() {
        // URL parametrelerini kontrol eder
        const args = new URLSearchParams(window.location.search);
        const code = args.get('code');

        // Eğer URL'de code varsa, token takası yapar
        if (code) {
            try {
                await this.exchangeToken(code);
            } catch (e) {
                console.error("Token Takas Hatası:", e);
            }

            // URL'yi temizler
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState({}, document.title, url.toString());
        }

        // Token kontrolü ve gerekirse yenileme yapar
        const tokenValid = await this.checkAndRefreshToken();

        if (!tokenValid) {
            // Token yok veya yenilenemedi
            localStorage.removeItem("spotify_access_token");
            localStorage.removeItem("spotify_refresh_token");
            localStorage.removeItem("spotify_token_expiry");
            return null;
        }

        let token = localStorage.getItem("spotify_access_token");

        // Token varsa verileri çek
        if (token) {
            try {
                const response = await fetch("https://api.spotify.com/v1/search?q=study&type=playlist&limit=3", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("spotify_access_token");
                    localStorage.removeItem("spotify_token_expiry");
                    return null;
                }

                const data = await response.json();

                if (data.error) {
                    console.error("API Hatası:", data.error);
                    return [];
                }

                if (!data.playlists || !data.playlists.items) {
                    return [];
                }

                return data.playlists.items.map(item => ({
                    name: item.name,
                    image: item.images[0]?.url,
                    uri: item.uri,
                    external_url: item.external_urls.spotify,
                    id: item.id
                }));

            } catch (error) {
                console.error("Spotify Hatası:", error);
                return [];
            }
        }

        return null;
    }

    static async getUserPlaylists() {
        // Token kontrolü ve gerekirse yenileme yapar
        const tokenValid = await this.checkAndRefreshToken();

        if (!tokenValid) {
            return null;
        }

        let token = localStorage.getItem("spotify_access_token");

        if (token) {
            try {
                const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=5", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("spotify_access_token");
                    localStorage.removeItem("spotify_token_expiry");
                    return null;
                }

                const data = await response.json();

                if (data.error) {
                    console.error("User Playlists API Hatası:", data.error);
                    return [];
                }

                if (!data.items) {
                    return [];
                }

                return data.items
                    .filter(item => item !== null)
                    .map(item => ({
                        name: item.name,
                        artist: item.owner?.display_name || "You",
                        image: item.images[0]?.url,
                        uri: item.uri,
                        external_url: item.external_urls.spotify,
                        id: item.id,
                        type: 'playlist'
                    }));

            } catch (error) {
                console.error("Spotify User Playlists Hatası:", error);
                return [];
            }
        }

        return null;
    }

    static async getRecommendations() {
        // Token kontrolü ve gerekirse yenileme yapar
        const tokenValid = await this.checkAndRefreshToken();

        if (!tokenValid) {
            return null;
        }

        let token = localStorage.getItem("spotify_access_token");

        if (token) {
            try {
                const response = await fetch("https://api.spotify.com/v1/search?q=focus%20chill%20study&type=playlist&limit=10", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("spotify_access_token");
                    localStorage.removeItem("spotify_token_expiry");
                    return null;
                }

                const data = await response.json();

                if (data.error) {
                    console.error("Browse API Hatası:", data.error);
                    return [];
                }

                if (!data.playlists || !data.playlists.items) {
                    return [];
                }

                return data.playlists.items
                    .filter(playlist => playlist !== null)
                    .map(playlist => ({
                        name: playlist.name,
                        artist: playlist.owner?.display_name || "Spotify",
                        image: playlist.images[0]?.url,
                        uri: playlist.uri,
                        external_url: playlist.external_urls.spotify,
                        id: playlist.id,
                        type: 'playlist'
                    }));

            } catch (error) {
                console.error("Spotify Recommendations Hatası:", error);
                return [];
            }
        }

        return null;
    }

    static async redirectToAuthCodeFlow() {
        const verifier = this.generateRandomString(128);
        const challenge = await this.generateCodeChallenge(verifier);

        localStorage.setItem("spotify_code_verifier", verifier);

        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", this.redirectUri);
        params.append("scope", this.scopes.join(" "));
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);

        document.location = `${this.authEndpoint}?${params.toString()}`;
    }

    static async exchangeToken(code) {
        const verifier = localStorage.getItem("spotify_code_verifier");

        if (!verifier) {
            console.error("Code Verifier bulunamadı!");
            return;
        }

        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", this.redirectUri);
        params.append("code_verifier", verifier);

        try {
            const result = await fetch(this.tokenEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });

            const data = await result.json();

            if (!result.ok) {
                console.error("Token Error Details:", data);
                return;
            }

            const { access_token, refresh_token, expires_in } = data;

            if (access_token) {
                localStorage.setItem("spotify_access_token", access_token);
                if (refresh_token) {
                    localStorage.setItem("spotify_refresh_token", refresh_token);
                }
                const expiryTime = Date.now() + (expires_in * 1000);
                localStorage.setItem("spotify_token_expiry", expiryTime);

                console.log("✅ Spotify token başarıyla kaydedildi! UI güncelleniyor...");
                if (typeof DashboardUI !== 'undefined' && DashboardUI.renderUnified) {
                    DashboardUI.renderUnified();
                }
            }
        } catch (error) {
            console.error("Token takas hatası:", error);
        }
    }
}