<template>
    <div class="clamp-wrap">
        <!--
      Animasi konten:
      - Saat collapsed → paragraf ter-clamp
      - Saat expanded → paragraf full
      Kita pakai <Transition mode="out-in"> agar pergantian halus.
    -->
        <Transition name="fade-slide" mode="out-in">
            <!-- COLLAPSED (clamped) -->
            <p v-if="!expanded" key="clamped" ref="para" class="clamp-text is-clamped" :style="inlineClampStyle">
                {{ text }}
            </p>

            <!-- EXPANDED (full) -->
            <p v-else key="expanded" class="clamp-text">
                {{ text }}
            </p>
        </Transition>

        <!-- Toggle button -->
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
        lines?: number;        // desktop
        linesTablet?: number;  // tablet
        linesMobile?: number;  // mobile
    }>(),
    { lines: 7, linesTablet: 9, linesMobile: 10 },
);

const para = ref<HTMLElement | null>(null);
const expanded = ref(false);
/**
 * showToggle = true hanya jika teks memang terpotong dalam keadaan COLLAPSED.
 * Saat expanded, kita tidak perlu re-evaluasi; toggle tetap tampil karena memang
 * sebelumnya terbukti terpotong.
 */
const showToggle = ref(false);

const inlineClampStyle = computed(() => ({ WebkitLineClamp: 'var(--clamp-lines)' } as any));

function checkTruncation() {
    // Hanya evaluasi ketika COLLAPSED (expanded=false)
    if (expanded.value) return;
    const el = para.value;
    if (!el) return;
    // Teks dianggap terpotong jika content lebih tinggi dari container yang ter-clamp
    showToggle.value = el.scrollHeight > el.clientHeight + 1;
}

function applyLines() {
    const el = para.value;
    if (!el) return;
    const w = window.innerWidth;
    const lines = w <= 600 ? props.linesMobile : w <= 1024 ? props.linesTablet : props.lines;
    el.style.setProperty('--clamp-lines', String(lines));
}

let ro: ResizeObserver | null = null;
function onResize() {
    // Saat collapsed, update clamp dan cek truncation
    if (!expanded.value) {
        applyLines();
        checkTruncation();
    }
}

function setup() {
    // setup awal untuk COLLAPSED
    applyLines();
    nextTick(checkTruncation);

    ro = new ResizeObserver(() => {
        if (!expanded.value) {
            applyLines();
            checkTruncation();
        }
    });
    if (para.value) ro.observe(para.value);

    window.addEventListener('resize', onResize, { passive: true });
}
function cleanup() {
    ro?.disconnect(); ro = null;
    window.removeEventListener('resize', onResize);
}

function toggle() {
    expanded.value = !expanded.value;
    // Jika kembali ke COLLAPSED, evaluasi ulang setelah render selesai
    nextTick(() => {
        if (!expanded.value) {
            applyLines();
            checkTruncation();
        }
    });
}

onMounted(setup);
onBeforeUnmount(cleanup);

// Jika teks berubah (navigasi produk), reset ke COLLAPSED & evaluasi ulang
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

/* Paragraf dasar */
.clamp-text {
    color: #1e1e1e;
    font-size: 18px;
    font-weight: 400;
    text-align: justify;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* COLLAPSED: jumlah baris dikontrol oleh var --clamp-lines */
.is-clamped {
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
    opacity: .85;
}

/* Animasi transisi konten (fade + slide) */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 220ms ease, transform 220ms ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(6px);
}

/* Mobile font sedikit lebih kecil */
@media (max-width: 600px) {
    .clamp-text {
        font-size: 16px;
    }
}
</style>
