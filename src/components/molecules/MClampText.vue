<template>
  <div class="clamp-wrap" :class="{ expanded }">
    <p
      ref="para"
      class="clamp-text"
      :class="!expanded ? 'is-clamped' : ''"
      :style="!expanded ? inlineClampStyle : undefined"
    >
      {{ text }}
    </p>

    <button
      v-if="showToggle"
      class="toggle-btn"
      type="button"
      :aria-expanded="expanded ? 'true' : 'false'"
      @click="toggle"
    >
      {{ expanded ? 'Sembunyikan' : 'Baca selengkapnya' }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';

  const props = withDefaults(
    defineProps<{
      text: string;
      lines?: number; // desktop
      linesTablet?: number; // tablet
      linesMobile?: number; // mobile
    }>(),
    { lines: 7, linesTablet: 9, linesMobile: 10 },
  );

  const para = ref<HTMLElement | null>(null);
  const expanded = ref(false);
  /** tombol hanya tampil jika teks benar2 terpotong saat COLLAPSED */
  const showToggle = ref(false);

  /** pakai CSS var untuk jumlah baris saat collapsed */
  const inlineClampStyle = computed(() => ({ WebkitLineClamp: 'var(--clamp-lines)' }) as any);

  function computeClampLines(): number {
    const w = window.innerWidth;
    return w <= 600 ? props.linesMobile : w <= 1024 ? props.linesTablet : props.lines;
  }

  function applyLines() {
    const el = para.value;
    if (!el) return;
    el.style.setProperty('--clamp-lines', String(computeClampLines()));
  }

  function checkTruncation() {
    // hanya cek saat collapsed
    if (expanded.value) return;
    const el = para.value;
    if (!el) return;
    // konten dianggap terpotong jika konten lebih tinggi dari container clamped
    showToggle.value = el.scrollHeight > el.clientHeight + 1;
  }

  let ro: ResizeObserver | null = null;
  function onResize() {
    if (!expanded.value) {
      applyLines();
      checkTruncation();
    }
  }

  function setupObservers() {
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

  function cleanupObservers() {
    ro?.disconnect();
    ro = null;
    window.removeEventListener('resize', onResize);
  }

  function toggle() {
    expanded.value = !expanded.value;
    // saat kembali ke collapsed, pastikan clamp diterapkan lalu re-check truncation
    nextTick(() => {
      if (!expanded.value) {
        applyLines();
        checkTruncation();
      }
    });
  }

  onMounted(setupObservers);
  onBeforeUnmount(cleanupObservers);

  /** reset saat teks berubah (navigasi produk) */
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

    /* animasi halus saat toggle */
    transition:
      opacity 220ms ease,
      transform 220ms ease;
  }

  .clamp-wrap:not(.expanded) .clamp-text {
    /* ketika masih collapsed, slightly lowered (untuk efek slide-up saat expand) */
    transform: translateY(6px);
    opacity: 0.98;
  }

  .clamp-wrap.expanded .clamp-text {
    transform: translateY(0);
    opacity: 1;
  }

  /* COLLAPSED: jumlah baris dikontrol var --clamp-lines */
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
    opacity: 0.85;
  }

  @media (max-width: 600px) {
    .clamp-text {
      font-size: 16px;
    }
  }
</style>
