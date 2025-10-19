<template>
    <div class="clamp-wrap">
        <p ref="para" :class="['clamp-text', !expanded ? clampClass : '']"
            :style="expanded ? undefined : inlineClampStyle">
            {{ text }}
        </p>

        <button v-if="showToggle" class="toggle-btn" type="button" :aria-expanded="expanded ? 'true' : 'false'"
            @click="toggle()">
            {{ expanded ? 'Sembunyikan' : 'Baca selengkapnya' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';

const props = withDefaults(
    defineProps<{
        text: string;
        /** jumlah baris saat collapsed (desktop) */
        lines?: number;
        /** override tablet */
        linesTablet?: number;
        /** override mobile */
        linesMobile?: number;
    }>(),
    { lines: 7, linesTablet: 9, linesMobile: 10 },
);

const para = ref<HTMLElement | null>(null);
const expanded = ref(false);
const showToggle = ref(false);

const clampClass = 'is-clamped';
const inlineClampStyle = computed(() => {
    // gunakan CSS var supaya bisa diubah via media query
    return {
        WebkitLineClamp: 'var(--clamp-lines)',
    } as any;
});

function checkTruncation() {
    if (!para.value) return;
    // Truncated jika konten tidak muat area tampilan (tinggi scroll > tinggi kontainer)
    showToggle.value = para.value.scrollHeight > para.value.clientHeight + 1;
}

function applyLines() {
    // set CSS var berdasarkan breakpoint saat ini
    const root = para.value as HTMLElement | null;
    if (!root) return;
    const width = window.innerWidth;
    const lines =
        width <= 600
            ? props.linesMobile
            : width <= 1024
                ? props.linesTablet
                : props.lines;
    root.style.setProperty('--clamp-lines', String(lines));
}

let ro: ResizeObserver | null = null;
function setupObservers() {
    applyLines();
    nextTick(checkTruncation);

    // Re-check saat konten/ukuran berubah
    ro = new ResizeObserver(() => {
        applyLines();
        checkTruncation();
    });
    if (para.value) ro.observe(para.value);

    window.addEventListener('resize', onResize, { passive: true });
}
function cleanupObservers() {
    ro?.disconnect();
    ro = null;
    window.removeEventListener('resize', onResize);
}
function onResize() {
    applyLines();
    checkTruncation();
}

function toggle() {
    expanded.value = !expanded.value;
    // setelah expand/collapse, cek lagi (kadang layout berubah)
    nextTick(checkTruncation);
}

onMounted(() => {
    setupObservers();
    // initial check (untuk teks yang baru di-bind)
    checkTruncation();
});

onBeforeUnmount(cleanupObservers);

// jika teks berubah (navigasi produk), reset state & re-evaluate
watch(
    () => props.text,
    async () => {
        expanded.value = false;
        await nextTick();
        applyLines();
        checkTruncation();
    },
);
</script>

<style scoped>
.clamp-wrap {
    display: grid;
    gap: 10px;
}

/* Teks dengan line clamp saat collapsed */
.clamp-text {
    color: #1e1e1e;
    font-size: 18px;
    font-weight: 400;
    text-align: justify;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Diberi class ini hanya saat collapsed */
.is-clamped {
    /* jumlah baris dikontrol oleh CSS var --clamp-lines (diisi via JS) */
    -webkit-line-clamp: var(--clamp-lines);
}

/* Tombol toggle */
.toggle-btn {
    appearance: none;
    border: none;
    background: transparent;
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    align-self: start;
    padding: 0;
    text-decoration: underline;
}

.toggle-btn:hover {
    opacity: 0.85;
}

/* Mobile font sedikit lebih kecil */
@media (max-width: 600px) {
    .clamp-text {
        font-size: 16px;
    }
}
</style>
