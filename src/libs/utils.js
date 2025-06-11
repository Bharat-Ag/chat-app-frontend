export const formateTime = (data) => {
    return new Date(data).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}
export const formateDate = (data) => {
    return new Date(data).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export const getInitialsFromName = (name = '') => {
    if (!name.trim()) return '';

    const words = name.trim().split(/\s+/); // split by any whitespace
    const firstTwo = words.slice(0, 2);
    const initials = firstTwo.map(word => word.charAt(0).toUpperCase()).join('');

    return initials;
};

export const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    let text = div.textContent || div.innerText || "";

    // Insert space before URLs if missing
    text = text.replace(/(\S)(https?:\/\/)/g, "$1 $2");

    return text;
}
export const extractLinks = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    const anchors = Array.from(div.querySelectorAll("a"));

    return anchors
        .map(a => {
            const href = a.getAttribute("href")?.trim();
            const text = a.textContent?.trim();

            if (!href || !text) return null;

            return { text, href };
        })
        .filter(Boolean);
};