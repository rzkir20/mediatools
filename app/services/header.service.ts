export function useStateHeader() {
    const menuOpen = ref(false);
    const servicesOpen = ref(false);
    const documentsOpen = ref(false);

    const route = useRoute();
    watch(
        () => route.path,
        () => {
            menuOpen.value = false;
            servicesOpen.value = false;
            documentsOpen.value = false;
        },
    );

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            menuOpen.value = false;
            servicesOpen.value = false;
            documentsOpen.value = false;
        }
    }

    onMounted(() => {
        document.addEventListener("keydown", onKeydown);
    });
    onUnmounted(() => {
        document.removeEventListener("keydown", onKeydown);
    });

    return { menuOpen, servicesOpen, documentsOpen };
}