(function () {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const searchInput = $("#searchInput");
    const emptyState = $("#emptyState");
    const openAllBtn = $("#openAllBtn");
    const closeAllBtn = $("#closeAllBtn");
    const labCount = $("#labCount");
    const totalLinkCount = $("#totalLinkCount");

    const allDetails = $$("details.lab");
    const allLinks = $$("a[href]");
    const semesterCards = $$(".card");

    // Small helper to safely escape user search text for RegExp
    function escapeRegExp(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // Remove previous highlight markup
    function clearHighlights(root = document) {
        $$("mark", root).forEach(mark => {
            const textNode = document.createTextNode(mark.textContent);
            mark.replaceWith(textNode);
        });
    }

    // Highlight matching text inside links and summary labels
    function highlightText(element, query) {
        if (!element) return;

        const original = element.dataset.originalText || element.textContent;
        element.dataset.originalText = original;

        if (!query) {
            element.innerHTML = original;
            return;
        }

        const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
        element.innerHTML = original.replace(regex, "<mark>$1</mark>");
    }

    // Keyboard shortcut: Ctrl + /
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "/") {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }

        if (e.key === "Escape") {
            searchInput.value = "";
            applyFilter("");
            searchInput.blur();
        }
    });

    // Count links inside each lab and show in the meta text
    allDetails.forEach(detail => {
        const count = $$("ol a[href]", detail).length;
        const meta = $(".meta", detail);
        if (meta) meta.textContent = count ? `${count} links` : "0 links";
    });

    function updateOverviewCounts() {
        const visibleLabs = allDetails.filter(detail => !detail.hidden).length;
        const visibleLinks = allLinks.filter(link => !link.closest("li")?.hidden).length;

        if (labCount) labCount.textContent = visibleLabs;
        if (totalLinkCount) totalLinkCount.textContent = visibleLinks;
    }

    function updateSemesterCounts() {
        semesterCards.forEach(card => {
            const visibleLinks = $$("a[href]", card).filter(link => !link.closest("li")?.hidden && !link.closest("details")?.hidden);
            const pill = $(".pill", card);
            if (pill) pill.textContent = `${visibleLinks.length} links`;
        });
    }

    function applyFilter(rawValue) {
        const query = rawValue.trim().toLowerCase();
        let anythingVisible = false;

        clearHighlights();

        allDetails.forEach(detail => {
            const summaryLabel = $("summary > span:first-child", detail);
            const summaryText = summaryLabel ? summaryLabel.textContent.toLowerCase() : "";
            const items = $$("ol li", detail);

            let hasMatchInLab = false;

            items.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                const matches = !query || itemText.includes(query) || summaryText.includes(query);

                item.hidden = !matches;

                const link = $("a", item);
                if (link) highlightText(link, query);

                if (matches) hasMatchInLab = true;
            });

            if (summaryLabel) highlightText(summaryLabel, query);

            detail.hidden = !!query && !hasMatchInLab && !summaryText.includes(query);

            if (query && !detail.hidden) {
                detail.open = true;
            }

            if (!detail.hidden) {
                anythingVisible = true;
            }
        });

        emptyState.hidden = anythingVisible;

        updateSemesterCounts();
        updateOverviewCounts();
    }

    searchInput.addEventListener("input", (e) => {
        applyFilter(e.target.value);
    });

    openAllBtn.addEventListener("click", () => {
        allDetails.forEach(detail => {
            if (!detail.hidden) detail.open = true;
        });
    });

    closeAllBtn.addEventListener("click", () => {
        allDetails.forEach(detail => {
            detail.open = false;
        });
    });

    // Initial overview values
    updateSemesterCounts();
    updateOverviewCounts();
})();