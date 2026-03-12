const btnEl = document.getElementById("btn");
const animeContainerEl = document.querySelector(".anime-container");
const animeImgEl = document.querySelector(".anime-img");
const animeNameEl = document.querySelector(".anime-name");

btnEl.addEventListener("click", async function() {
    let attempts = 0;
    const maxAttempts = 4;
    
    async function fetchCharacter() {
        try {
            btnEl.disabled = true;
            animeNameEl.textContent = "Loading...";
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch("https://api.jikan.moe/v4/random/characters", {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Quick validation of response
            if (!data?.data?.name?.trim() || !data?.data?.images?.jpg?.image_url) {
                throw new Error("Invalid character data");
            }
            
            const character = data.data;
            const imageUrl = character.images.jpg.image_url;
            
            // Load and validate image with 6-second timeout
            return new Promise((resolve, reject) => {
                const img = new Image();
                const imageTimeout = setTimeout(() => {
                    reject(new Error("Image load timeout"));
                }, 6000);
                
                img.onload = () => {
                    clearTimeout(imageTimeout);
                    animeImgEl.src = imageUrl;
                    animeNameEl.textContent = character.name;
                    animeContainerEl.style.display = "block";
                    btnEl.disabled = false;
                    resolve();
                };
                
                img.onerror = () => {
                    clearTimeout(imageTimeout);
                    reject(new Error("Image failed to load"));
                };
                
                img.src = imageUrl;
            });
            
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, error.message);
            
            if (attempts < maxAttempts) {
                console.log(`Retrying... (${maxAttempts - attempts} left)`);
                await new Promise(resolve => setTimeout(resolve, 300));
                return fetchCharacter();
            } else {
                animeNameEl.textContent = "Try again!";
                animeContainerEl.style.display = "block";
                btnEl.disabled = false;
            }
        }
    }
    
    fetchCharacter();
})