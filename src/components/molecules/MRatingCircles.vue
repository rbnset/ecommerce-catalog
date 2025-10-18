<template>
    <div class="rating">
        <span v-if="rate !== null" class="rate">{{ rate.toFixed(1) }}</span>
        <div class="circles-rate">
            <span v-for="i in 5" :key="i" class="circle" :class="classFor(i)"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * Rating dengan threshold seperti contoh:
 * i=1 → <0.5 = ghost, else filled
 * i=2 → <1.5 = ghost, else filled
 * i=3 → <2.5 = ghost, else filled
 * i=4 → <3.5 = ghost, else filled
 * i=5 → <4.5 = ghost, else filled
 * Tone 'navy'|'purple' mempengaruhi kelas ghost/filled-nya.
 */
const props = defineProps<{ rate: number | null; tone: 'navy' | 'purple' }>();

function classFor(i: number) {
    const r = props.rate ?? 0;
    const limit = i - 0.5;
    const filled = r >= limit;
    const t = props.tone === 'navy' ? 'navy' : 'purple';
    return filled ? `bgrd-${t}` : `bgrd-white-${t}`;
}
</script>

<style scoped>
.rating {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.rate {
    font-weight: 600;
}

.circles-rate {
    display: flex;
    gap: .1rem;
}

.circle {
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
    display: inline-block;
}

@media (max-width: var(--bp-mobile)) {
    .circle {
        width: .8rem;
        height: .8rem;
    }
}
</style>
