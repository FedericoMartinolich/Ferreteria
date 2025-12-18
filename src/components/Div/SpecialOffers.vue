<template>
    <div class="full-width">
        <div class="special-offers">
            <div class="carousel-container">
                <button class="carousel-btn prev" @click="prevSlide">❮</button>
                
                <div class="carousel-wrapper">
                    <div class="carousel-slide" v-for="(offer, index) in offers" :key="index" 
                            v-show="currentSlide === index">
                        <div class="offer-content">
                            <h2>{{ offer.title }}</h2>
                            <p>{{ offer.description }}</p>
                            <span class="discount">{{ offer.discount }}</span>
                        </div>
                    </div>
                </div>
                
                <button class="carousel-btn next" @click="nextSlide">❯</button>
            </div>
            
            <div class="carousel-dots">
                <span v-for="(_, index) in offers" :key="index" 
                            @click="currentSlide = index"
                            :class="{ active: currentSlide === index }"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpecialOffers',
    data() {
        return {
            currentSlide: 0,
            offers: [
                {
                    title: 'Special Offer 1',
                    description: 'Get up to 50% off',
                    discount: '-50%'
                },
                {
                    title: 'Special Offer 2',
                    description: 'Limited time deal',
                    discount: '-30%'
                },
                {
                    title: 'Special Offer 3',
                    description: 'Exclusive for members',
                    discount: '-40%'
                }
            ]
        }
    },
    methods: {
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.offers.length;
        },
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.offers.length) % this.offers.length;
        }
    }
}
</script>

<style scoped>

.special-offers {
    width: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.carousel-container {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
}

.carousel-wrapper {
    flex: 1;
    overflow: hidden;
    border-radius: 8px;
    background: white;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-slide {
    width: 100%;
    animation: fadeIn 0.5s;
}

.offer-content {
    text-align: center;
    padding: 40px 20px;
}

.offer-content h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
    color: #333;
}

.offer-content p {
    margin: 0 0 20px 0;
    color: #666;
}

.discount {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 20px;
    font-weight: bold;
}

.carousel-btn {
    background: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 20px;
    line-height: 1;
    color: #667eea;
}

.carousel-btn:hover {
    background: #f0f0f0;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.carousel-dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background 0.3s;
}

.carousel-dots span.active {
    background: white;
}

.prev {
    margin-left: 120px;
}
.next {
    margin-right: 120px;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>