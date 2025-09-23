<template>
  <div ref="giscusContainer" class="giscus"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const giscusContainer = ref(null);

onMounted(() => {
  if (giscusContainer.value.querySelector("iframe")) return;

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.setAttribute("data-repo", "Fatpandac/fatpandac");
  script.setAttribute("data-repo-id", "R_kgDOGyFymw");
  script.setAttribute("data-category", "Announcements");
  script.setAttribute("data-category-id", "DIC_kwDOGyFym84CvzD-");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", "preferred_color_scheme");
  script.setAttribute("data-lang", "zh-CN");
  script.crossOrigin = "anonymous";

  if (giscusContainer.value) {
    giscusContainer.value.appendChild(script);
  }
});
</script>
