<template>
  <div ref="giscusContainer" class="giscus"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const giscusContainer = ref(null);

const loadGiscus = (isDark) => {
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
  script.setAttribute("data-theme", isDark ? "dark" : "light");
  script.setAttribute("data-lang", "zh-CN");
  script.crossOrigin = "anonymous";

  if (giscusContainer.value) {
    giscusContainer.value.innerHTML = "";
    giscusContainer.value.appendChild(script);
  }
};


onMounted(() => {
  const box = document.querySelector("html");
  const isDark = box.classList.contains("dark");
  loadGiscus(isDark);

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        const isDark = box.classList.contains("dark");
        loadGiscus(isDark);
      }
    }
  })
  observer.observe(box, { attributes: true });
});
</script>
